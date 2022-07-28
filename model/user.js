const fs = require('fs');
const Connection = require('./connection');

class User {
    constructor(){
        this.connection = Connection.createConnection();
        this.connection.connect((err) => {
            if (err) {
                console.log(err)
            } else {
                console.log('Connect success!');
            }
        });
    }
        getUser(req,res){
        return new Promise((resolve,reject)=>{
           this.connection.query('select * from User',(err,data)=>{
               if(err) {
                   reject(err);
               }
               else{
                   resolve(data)
               }
           })
        })   
       }
        insertUser(user){
           let createSql = `insert into User(Username,Password,Address,Email,PhoneNumber) values ('${user.username}','${user.password}','${user.address}','${user.email}','${user.phonenumber}')`;
           this.connection.query(createSql, (err,data)=>{
               if(err){
                   console.log(err);
               }
               else {
                   console.log('Create Success !!');
               }
           })
       }
       getUserId(id) {
        return new Promise((resolve,rejesct)=>{
            let query = `select * from User where id = ${id}`;
            this.connection.query(query,(err,data)=>{
                if(err){
                    rejesct(err);
                }
                else {
                    resolve(data);
                }
            })
        })
       }

       updateUser(id, user) {
        let query =`update User set Username = '${user.username}',Password='${user.password}',Address='${user.address}',
        Email='${user.email}',PhoneNumber='${user.phonenumber}' where id = ${id};`
        this.connection.query(query,(err,data)=>{
            if (err) {
                console.log(err);
            } else {
                console.log('Update success')
            }
        })
       }

       deleteProduct(id){
        let query = `delete from User where id = ${id}`;
        this.connection.query(query, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Delete success')
            }
        })
        }
        
}
module.exports = User;