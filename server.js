const http = require("http");
const url = require("url");
const fs = require("fs");
const qs = require("qs");

const Usercontroller = require("./controller/user-controller");
const ErrorController = require("./controller/error-controller");
const HomeController = require("./controller/home-controller");
const BookshelfController = require("./controller/bookshelf-controller");

let errorController = new ErrorController();
let userController = new Usercontroller();
let homeController = new HomeController();
let bookshelfController = new BookshelfController();

const mimeTypes = {
  html: "text/html",
  js: "text/javascript",
  css: "text/css",
  "min.js": "text/javascript",
  "js.map": "text/javascript",
  "css.map": "text/css",
  "min.css": "text/css",
  jpg: "image/jpg",
  png: "image/png",
  gif: "image/gif",
  woff: "text/html",
  ttf: "text/html",
  woff2: "text/html",
  eot: "text/html",
};

let server = http.createServer((req, res) => {
  let path = url.parse(req.url);
  let pathUrl = path.pathname;

  let method = req.method;

  switch (pathUrl) {
    case "/": {
      homeController.showHomePage(req, res);
      break;
    }
    case "/register/": {
      if (method === "GET") {
        userController.showFormCreateUser(req, res);
      } else {
        userController.createUser(req, res);
      }
      break;
    }
    case "/admin/": {
      fs.readFile("views/admin.html", "utf-8", (err, data) => {
        if (err) {
          throw new Error(err.message);
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          return res.end();
        }
      });

      break;
    }
    case "/login/": {
      if (method === "GET") {
        fs.readFile("views/login/login.html", "utf-8", (err, data) => {
          if (err) {
            throw new Error(err.message);
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            return res.end();
          }
        });
      } else {
        userController.loginUser(req, res);
      }

      break;
    }

    case "/user/": {
      userController.showListUser(req, res);
      break;
    }

    case "/update/": {
      if (method == "GET") {
        userController.showUserEditForm(req, res);
      } else {
        userController.editUser(req, res);
      }
      break;
    }

    case "/admin/bookshelf": {
      bookshelfController.showBookshelfListPage(req, res);
      break;
    }

    case "/admin/bookshelf/create": {
      if (method === "GET") {
        bookshelfController.showBookshelfFormCreate(req, res);
      } else {
        bookshelfController.createBookshelf(req, res);
      }
      break;
    }

    case "/admin/bookshelf/edit": {
      let query = qs.parse(path.query);
      let idUpdate = query.id;
      if (method === "GET") {
        bookshelfController.showBookshelfEditForm(req, res, idUpdate);
      } else {
        bookshelfController.editBookshelf(req, res, idUpdate);
      }
      break;
    }

    case "/admin/bookshelf/delete": {
      let query = qs.parse(path.query);
      let idUpdate = query.id;
      if (method === "GET") {
        bookshelfController.deleteBookshelf(req, res, idUpdate);
      } else {
        bookshelfController.showBookshelfListPage(req, res);
      }
      break;
    }

    default:
      const filesDefences = req.url.match(/\.js|\.css|\.png|\.jpg/);
      if (filesDefences) {
        const extension = mimeTypes[filesDefences[0].toString().split(".")[1]];
        res.writeHead(200, { "Content-Type": extension });
        fs.createReadStream(__dirname + "/" + req.url).pipe(res);
      } else {
        res.end();
      }

      // errorController.showError404Page(req,res);
      break;
  }
});

server.listen(8003, () => {
  console.log("Server is running http//:localhost:8003");
});
