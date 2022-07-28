const Connection = require("./connection");

class Bookshelf {
  constructor() {
    this.connection = Connection.createConnection();
    this.connection.connect((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Connect success!");
      }
    });
  }

  getBookshelfs() {
    return new Promise((resolve, reject) => {
      this.connection.query("select * from kho", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  createBookshelf(bookshelf) {
    let insertQuery = `insert into kho(TenKho, MoTa, SLDeSach, SLSachTrongKho)
                           VALUES ('${bookshelf.name}', "${bookshelf.description}", '${bookshelf.number_of_titles}', '${bookshelf.number_of_books}')`;
    this.connection.query(insertQuery, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Insert success");
      }
    });
  }

  getBookshelf(id) {
    return new Promise((resolve, reject) => {
      let query = `select * from kho where id = ${id}`;
      this.connection.query(query, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  updateBookshelf(id, bookshelf) {
    return new Promise((resolve, reject) => {
      let query = `update kho set TenKho = '${bookshelf.name}', MoTa = '${bookshelf.description}', SLDeSach = '${bookshelf.number_of_titles}', SLSachTrongKho = '${bookshelf.number_of_books}'  where id = ${bookshelf.id}`;
      this.connection.query(query, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  deleteBookshelf(id) {
    return new Promise((resolve, reject) => {
      let query = `delete from kho where id = ${id}`;
      this.connection.query(query, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
          console.log("Delete success");
        }
      });
    });
  }
}

module.exports = Bookshelf;
