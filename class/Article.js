var connection = require('../config/bdd')

class Article {


    static create(titre,contenu,user_id,cb){

    connection.query('INSERT INTO laisse_article SET title = ?, content = ?, created_at = ?, posted_by = ?',
     [titre,contenu, new Date(), user_id], (err,results) => {
        if(err) throw err
        cb(results) 


    })
 }



 static update(titre,contenu,id, cb){

    connection.query('UPDATE laisse_article SET title = ?, content = ? WHERE id = ?',
     [titre,contenu,id], (err,results) => {
        if(err) throw err
        cb(results)
    })
 }


    static all(cb){
        // recuperation de tous les articles
        connection.query('SELECT LA.id, title, content, LA.created_at, username ' + 
        ' FROM laisse_article AS LA ' + 
        ' INNER JOIN users AS U ON U.id = LA.posted_by',(err,rows) =>{
    
            if(err) throw err
            cb(rows)
        })
    }

    static recents(cb){
        // recuperation 5 derniers articles
        connection.query('SELECT LA.id, title, content, LA.created_at, username ' + 
        ' FROM laisse_article AS LA ' + 
        ' INNER JOIN users AS U ON U.id = LA.posted_by ' +
        ' ORDER BY LA.created_at DESC LIMIT 5', (err, rows) =>{
        
            if(err) throw err
            cb(rows)
        })
    }

    static tree(cb){
        // recuperation 5 derniers articles
        connection.query('SELECT LA.id, title, content, LA.created_at, username ' + 
        ' FROM laisse_article AS LA ' + 
        ' INNER JOIN users AS U ON U.id = LA.posted_by ' +
        ' ORDER BY LA.created_at DESC LIMIT 3', (err, rows) =>{
        
            if(err) throw err
            cb(rows)
        })
    }



    static one(id,cb){
    connection.query('SELECT LA.id, title, content, LA.created_at, username, posted_by ' + 
        ' FROM laisse_article AS LA ' + 
        ' INNER JOIN users AS U ON U.id = LA.posted_by ' +
        ' WHERE LA.id = ?', id, (err,rows) =>{
        if(err) throw err
            cb(err, rows)
    })
}


    static solo(cb){
    connection.query('SELECT * FROM laisse_article ORDER BY created_at DESC LIMIT 1',(err,rows) =>{
    
        if(err) throw err
            cb(rows)
 
    })
}


   static delete(id, cb){
    connection.query('DELETE FROM laisse_article WHERE id = ?', id,(err,rows) =>{
    
        if(err) throw err
            cb(rows)
 
    })
}


}
module.exports = Article