const User = require("../model/user");
const fs = require("fs");
const qs = require("qs");

class UserController {
  constructor() {
    this.user = new User();
  }

  showListUser(req, res) {
    fs.readFile("views/user/list-user.html", "utf-8", async (err, data) => {
      if (err) {
        throw new Error(err.message);
      } else {
        let users = await this.user.getUser();
        let tbody = "";
        users.map((user, index) => {
          tbody += ` 
                    <tr>
                    <td ">${index + 1}</th>
                    <td ">${user.Username}</td>
                    <td ">${user.Password}</td>
                    <td ">${user.Address}</td>
                    <td ">${user.DOB} </td>
                    <td ">${user.Email}</td>
                    <td ">${user.PhoneNumber}</td>
                    <td><a href="/update/${
                      user.id
                    }" class="btn btn-primary">Edit</a></td>
                    <td><a href="/delete/${
                      user.id
                    }" class="btn btn-danger">Delete</a></td>
                  </tr>`;
        });
        data = data.replace("{user}", tbody);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      }
    });
  }
  showFormCreateUser(req, res) {
    fs.readFile("views/register/register.html", "utf-8", (err, data) => {
      if (err) {
        throw new Error(err.message);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end("ok");
      }
    });
  }
  createUser(req, res) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", async () => {
      let success = true;
      let user = qs.parse(data);

      let regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      if (!regexPassword.test(user.password)) {
        console.log("Mật khẩu phải có hơn 8 kí tự và ít nhất 1 số!");
      } else {
        // if(user.password !== user.passwordConfirm){
        //     console.log('Mật khẩu xác nhận không đúng!');
        // }else {
        let dataUser = await this.user.getUser();
        for (let users of dataUser) {
          if (user.email === users.email) {
            console.log("email đã tồn tại!");
            success = false;
          } else if (user.phone === users.phone) {
            console.log("Số điện thoại đã tồn tại");
            success = false;
          }
        }
        if (success === true) {
          this.user.insertUser(user);
          this.user.createRole(user);
          res.writeHead(301, {
            location: "/login",
          });
          return res.end();
        }
      }
    });
  }
  showUserEditForm(req, res, idUpdate) {
    fs.readFile("views/update/update.html", "utf-8", async (err, data) => {
      if (err) {
        throw new Error(err.message);
      } else {
        let user = await this.user.getUserId(idUpdate);
        if (user.length > 0) {
          data = data.replace("{name}", user.Username);
          data = data.replace("{email}", user.Email);
          data = data.replace("{phone}", user.PhoneNumber);
          data = data.replace("{dob}", user.DOB);
          data = data.replace("{address}", user.Address);
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      }
    });
  }
  editUser(req, res, id) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      let user = qs.parse(data);
      this.user.updateUser(id, user);
      res.writeHead(301, {
        location: "/user",
      });
      return res.end();
    });
  }
  loginUser(req, res) {
    let flag = false;
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", async () => {
      data = qs.parse(data);
      let dataUser = await this.user.getUser();
      for (let user of dataUser) {
        if (data.email === user.Email && data.password == user.Password) {
          flag = true;
          break;
        }
      }
      if (flag) {
        console.log("Login Success");
        res.writeHead(301, { location: "/admin" });
        return res.end();
      } else {
        console.log("Tai khoan khong ton tai");
        res.end();
      }
    });
  }
}
module.exports = UserController;
