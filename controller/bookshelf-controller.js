const Bookshelf = require("../model/bookshelf");
const fs = require("fs");
const qs = require("qs");
const Connection = require("../model/connection");
const { resolve } = require("path");
class BookshelfController {
  constructor() {
    this.bookshelf = new Bookshelf();
  }

  showBookshelfListPage(req, res) {
    fs.readFile("views/bookshelf/list.html", "utf-8", async (err, data) => {
      if (err) {
        console.log("File NotFound!");
      } else {
        let bookshelfs = await this.bookshelf.getBookshelfs();
        let tbody = "";
        //     bookshelfs.map((bookshelf, index) => {
        //         tbody += `<tr>
        //     <td>${index + 1}</td>
        //     <td>${bookshelf.name}</td>
        //     <td>${bookshelf.price}</td>
        //     <td><a href="/bookshelfs/edit/${bookshelf.id}" class="btn btn-primary">Edit</a></td>
        //     <td><a href="/bookshelfs/delete/${bookshelf.id}" class="btn btn-danger">Delete</a></td>
        // </tr>`;
        //     });
        for (let index = 0; index < bookshelfs.length; index++) {
          tbody += ` <tr>
                                            <td>
                                                <div class="custom-control custom-checkbox">
                                                                <input type="checkbox" class="custom-control-input" id="customCheck${
                                                                  index + 1
                                                                }">
                                                                <label class="custom-control-label" for="customCheck${
                                                                  index + 1
                                                                }">&nbsp;</label>
                                                            </div>
                                            </td>
                                            <td>${bookshelfs[index].name}</td>
                                            <td>${bookshelfs[index].price}</td>
                                            <td>
                                                <a href="javascript:void(0);" class="action-icon btn btn-primary text-white">Edit</a>
                                                <a href="javascript:void(0);" class="action-icon  btn btn-danger  text-white">Delete</a>
                                            </td>
                                        </tr>`;
        }
        data = data.replace("{bookshelfs}", tbody);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      }
    });
  }

  showBookshelfFormCreate(req, res) {
    fs.readFile("views/bookshelfs/create.html", "utf-8", (err, data) => {
      if (err) {
        console.log("File NotFound!");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      }
    });
  }

  createBookshelf(req, res) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      let bookshelf = qs.parse(data);
      this.bookshelf.createBookshelf(bookshelf);
      res.writeHead(301, {
        location: "/bookshelfs",
      });
      return res.end();
    });
  }

  showBookshelfEditForm(req, res, idUpdate) {
    fs.readFile("views/bookshelfs/edit.html", "utf-8", async (err, data) => {
      if (err) {
        console.log("File NotFound!");
      } else {
        let bookshelf = await this.bookshelf.getBookshelf(idUpdate);
        if (bookshelf.length > 0) {
          data = data.replace("{id}", bookshelf[0].id);
          data = data.replace("{name}", bookshelf[0].name);
          data = data.replace("{price}", bookshelf[0].price);
          data = data.replace("{description}", bookshelf[0].description);
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      }
    });
  }

  // editBookshelf(req, res, id) {
  //   let data = "";
  //   req.on("data", (chunk) => {
  //     data += chunk;
  //   });
  //   req.on("end", () => {
  //     let bookshelf = qs.parse(data);
  //     this.bookshelf.updateBookshelf(id, bookshelf);
  //     res.writeHead(301, {
  //       location: "/bookshelfs",
  //     });
  //     return res.end();
  //   });
  // }
showSearch(req, res){
  fs.readFile('views/search/team.html','utf-8', async (err,data)=> {
    if(err) {
      console.log(`File không tồn tại`)
    } else {
        const bookshelfs = await this.bookshelf.setBooksCategory();
        let tbody = '';         
        bookshelfs.forEach((item, index)=>{
          tbody += ` <tr>
                                            <td>
                                                <div class="custom-control custom-checkbox">
                                          
                                                <label class="custom-control-label" for="customCheck${
                                                index + 1
                                                }">&nbsp;</label>
                                                </div>
                                            </td>
                                            <td>${item.TenSach}</td>
                                            <td>${item.SachMoTa}</td>
                                            <td>${item.TenTheLoai}</td>
                                            <td>${item.TinhTrang}</td>
                                            <td>${item.TenKho}</td>
                                            <td>${item.KhoMoTa}</td>
                                            <td>${item.SLDeSach}</td>
                                            <td>${item.SLSachTrongKho}</td>

                                        </tr>`;
        })
        
            data = data.replace("{bookshelfs}", tbody);
          
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            return res.end();
      };
})
}

   findByCategory(req, res) {

          fs.readFile('views/search/team.html','utf-8', async (err,data)=> {
            if(err) {
              console.log(`File không tồn tại`)
            } else {
              let data1 = "";
              req.on("data",(chunk) => {
                data1 += chunk;
              });
             
              req.on("end", async() => {
                let data2 = qs.parse(data1);
                const bookshelfs = await this.bookshelf.getBookshelfsCategory(data2);
                let tbody = ''              
                bookshelfs.forEach((item, index)=>{
                  tbody += ` <tr>
                                                    <td>
                                                        <div class="custom-control custom-checkbox">
                                                                 
                                                                        <label class="custom-control-label" for="customCheck${
                                                                          index + 1
                                                                        }">&nbsp;</label>
                                                                    </div>
                                                    </td>
                                                    <td>${item.TenSach}</td>
                                            <td>${item.SachMoTa}</td>
                                            <td>${item.TenTheLoai}</td>
                                            <td>${item.TinhTrang}</td>
                                            <td>${item.TenKho}</td>
                                            <td>${item.KhoMoTa}</td>
                                            <td>${item.SLDeSach}</td>
                                            <td>${item.SLSachTrongKho}</td>

                                                </tr>`;
                })
                
                    data = data.replace("{bookshelfs}", tbody);
                  
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.write(data);
                    return res.end();
              });
  
                  
            }
          })
        
      }

     
    }

module.exports = BookshelfController;
