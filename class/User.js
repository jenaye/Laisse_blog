var connection = require('../config/bdd')

class User {

    static login(username,password, cb){
    connection.query("SELECT * FROM users WHERE username = ? AND password = ?", [username,password],(err,rows) =>{
   
        if(err) throw err
            cb(rows) 

 
   			})
		}


        static editProfile(id, cb){
    connection.query("SELECT * FROM users WHERE id = ? ",id,(err,rows) =>{
   
        if(err) throw err
            cb(rows) 

 
            })
        }

        static updateProfile(username,description,twitter,id, cb){
    connection.query("UPDATE  users SET username = ?, description = ?, twitter = ? WHERE id = ?",
     [username,description,twitter,id],(err,rows) =>{
   
        if(err) throw err
            cb(rows) 

 
            })
        }


		static private(id,cb){
        // recuperation de tous les articles
        connection.query('SELECT id, title, content, created_at, posted_by FROM laisse_article '+
        	'WHERE posted_by = ? ',id,(err,rows) =>{
     if(err) throw err
            cb(rows)

        })
    }

    static verifMail(email,cb){
        // recuperation de tous les articles
        connection.query('SELECT email FROM users WHERE email = ? ',email,(err,rows) =>{
     if(err) throw err
            cb(false)

        })
    }

      static create(username,email,password, cb){

    connection.query('INSERT INTO users SET username = ?, email = ? ,password = ?, description = NULL , twitter = NULL , created_at = ?',
     [username,email,password, new Date()], (err,results) => {
        if(err) throw err
        cb(results) 


    })
 }



}


module.exports = User