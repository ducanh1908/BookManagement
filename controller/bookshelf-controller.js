const Bookshelf = require("../model/bookshelf");
const fs = require("fs");
const qs = require("qs");

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
        for (let index = 0; index < bookshelfs.length; index++) {
          tbody += `<tr>
                                            <td>${bookshelfs[index].id}</td>
                                            <td>${bookshelfs[index].TenKho}</td>
                                            <td>${bookshelfs[index].SLDeSach}</td>
                                            <td>${bookshelfs[index].SLSachTrongKho}</td>
                                            <td>${bookshelfs[index].MoTa}</td>
                                            <td>
                                                <a href="/admin/bookshelf/edit?id=${bookshelfs[index].id}" class="action-icon btn btn-primary text-white"> EDIT </a>
                                                <a href="/admin/bookshelf/delete?id=${bookshelfs[index].id}" class="action-icon btn btn-danger text-white"> DELETE </a>
                                            </td>
                                        </tr>`;
        }
        data = data.replace("{bookshelf}", tbody);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      }
    });
  }

  showBookshelfFormCreate(req, res) {
    fs.readFile("views/bookshelf/create.html", "utf-8", (err, data) => {
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
        location: "/admin/bookshelf",
      });
      return res.end();
    });
  }

  showBookshelfEditForm(req, res, idUpdate) {
    fs.readFile("views/bookshelf/edit.html", "utf-8", async (err, data) => {
      if (err) {
        console.log("File NotFound!");
      } else {
        let bookshelf = await this.bookshelf.getBookshelf(idUpdate);
        if (bookshelf.length > 0) {
          data = data.replace("{id}", bookshelf[0].id);
          data = data.replace("{name}", bookshelf[0].TenKho);
          data = data.replace("{number-of-titles}", bookshelf[0].SLDeSach);
          data = data.replace("{number-of-books}", bookshelf[0].SLSachTrongKho);
          data = data.replace("{description}", bookshelf[0].MoTa);
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      }
    });
  }

  editBookshelf(req, res, id) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      let bookshelf = qs.parse(data);
      this.bookshelf.updateBookshelf(id, bookshelf).then(() => {
        res.writeHead(301, {
          location: "/admin/bookshelf",
        });
        return res.end();
      });
    });
  }

  deleteBookshelf(req, res, id) {
    this.bookshelf.deleteBookshelf(id).then(() => {
      res.writeHead(301, {
        location: "/admin/bookshelf",
      });
      return res.end();
    });
  }
}

module.exports = BookshelfController;
