var express = require('express')
var app = express()
var session = require('express-session');
var bodyParser = require('body-parser')
var log4js = require('log4js');

app.set('view engine', 'ejs')
app.use('/assets', express.static('public'))

app.use(session({secret: 'secret_password_api',resave:false, saveUninitialized:true}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'logs/not_found.log', category: '404' }
    ]
});

app.use(function(req, res, next){
    res.locals.authenticated = false;
    if(req.session.hasOwnProperty('userdata')){
        res.locals.userdata = req.session.userdata;
        res.locals.authenticated = true;
    }
    next();
});

var sess;
app.get('/', (request, response) => {
    var Article = require('./class/Article.js')
    var real_ip = request.ip;
        var ip = real_ip.replace(/^.*:/, '')
    console.log(ip)
    var path = request.path;
    var id = request.params.id;


    Article.tree(function(data) {
        response.render('layout/index', {data: data, ip:ip, path:path})
        var logger = log4js.getLogger('User');
        logger.trace("Acces à la page d'accueil, Route: "+request.path);
    })

})


app.get('/profile/:id(\\d+)', (request, response) => {

    if(request.session.hasOwnProperty('userdata')){
        var id = request.session.userdata.id;
        var User = require('./class/User.js')
        User.editProfile(id, function(article) {

            response.render('account/edit_profile', {id:id,user: request.session.userdata})
        })

    }else{

        return response.redirect('/login');
    }
})


app.post('/profile/:id(\\d+)', (request, response) => {

    if(request.session.hasOwnProperty('userdata')){
        var id = request.session.userdata.id;

          var description = request.body.description
          var username = request.body.username
          var twitter = request.body.twitter

        var User = require('./class/User.js')
        User.updateProfile(username,description,twitter,id, function(cb) {

            response.render('account/edited_profile', {id:id,user: request.session.userdata})
        })

    }else{

        return response.redirect('/login');
    }
})


app.get('/profile', (request, response) => {

    if(request.session.hasOwnProperty('userdata')){
       
        var real_ip = request.ip;
        var ip = real_ip.replace(/^.*:/, '')
        var id = request.session.userdata.id;
        var User = require('./class/User.js')
        User.private(id, function(article) {

            response.render('account/profile', {ip:ip, id:id,user: request.session.userdata, article:article})
        })

    }else{

        return response.redirect('/login');
    }
})

app.get('/register', (request, response) => {
    if(request.session.hasOwnProperty('userdata')){
        return response.redirect('/profile');
        var logger = log4js.getLogger('User');
        logger.trace("Acces à la page d'inscription, Route: "+request.path);

    }
    return  response.render('account/register')

})



app.post('/register', (request, response) => {



    var email = request.body.email
    var username = request.body.username
    var password = request.body.password


    var User = require('./class/User.js')
    User.verifMail(email, function(data_email) {

        if(data_email == true){

            response.send('email deja utiliser')
             User.create(username,email,password, function(data) {


        if(data.length !== 0){
            request.session.userdata = data[0];
            return response.redirect('/login');
        }else{
            
        return response.render('error/wrong_register')
        }

        })
        }



        else{
            
        return response.render('error/wrong_register_email')
        }

    })


})






app.get('/login', (request, response) => {
    if(request.session.hasOwnProperty('userdata')){
        return response.redirect('/profile');
        var logger = log4js.getLogger('User');
        logger.trace("Acces à la page connexion, Route: "+request.path);

    }
    return  response.render('account/login')

})

app.post('/login', (request, response) => {


    if(request.session.hasOwnProperty('userdata')){
        unset(request.session.userdata)
    }

    var real_ip = request.ip;
    var username = request.body.username
    var password = request.body.password

    var User = require('./class/User.js')
    User.login(username,password, function(data) {


        if(data.length !== 0){
            request.session.userdata = data[0];
            return response.redirect('/profile');
        }
        var logger = log4js.getLogger('User');
        logger.error("Mauvais login, Route: "+request.path+" IP : "+real_ip);
        return response.render('error/wrong_login')

    })

})



app.get('/logout', (request, response) => {

      if(request.session.hasOwnProperty('userdata')){
        delete(request.session.userdata)
    }
     var logger = log4js.getLogger('User');
        logger.error("Deconnexion d'un utilisateur");
    response.redirect('/')

})



app.get('/articles/:id(\\d+)', (request, response) => {
    var Article = require('./class/Article.js')
    var id = request.params.id;
    var moment = require('moment')
    moment.locale('fr');

    Article.one(id, function(err, data) {
        if(data.length == 0){
            response.send('cet article a ete supprime');
        }
        var auth = (response.locals.authenticated && response.locals.userdata.id === data[0].posted_by)
        response.render('articles/one', {data: data, id:id, moment: moment, auth:auth})
    })
})




app.get('/articles/all', (request, response) => {
    var Article = require('./class/Article.js')
    var moment = require('moment')
    moment.locale('fr');
    Article.all(function(data) {

        response.render('articles/all', {data: data, moment: moment})
        var logger = log4js.getLogger('User');
        logger.trace("Acces à tous les articles, Route : "+request.path);
    })

})




app.get('/articles/recents', (request, response) => {
    var Article = require('./class/Article.js')
    var moment = require('moment')
    moment.locale('fr');
    Article.recents(function(data) {

        response.render('articles/fivelast', {data: data, moment: moment})
        var logger = log4js.getLogger('User');
        logger.trace("Acces aux 5 derniers article, Route : "+request.path);
    })
})



app.get('/articles/new', (request, response) => {
    if(request.session.hasOwnProperty('userdata')){
        var id = request.session.userdata.id;
        console.log(id);
    response.render('articles/new')
    }else{
        response.redirect('/')
    }

})

app.post('/articles/new', (request, response) => {

    if(request.session.hasOwnProperty('userdata')){
        var user_id = request.session.userdata.id;

    var titre = request.body.titre
    var contenu = request.body.contenu
    var Article = require('./class/Article.js')
    Article.create(titre,contenu,user_id, function(results){
        var id = results.insertId;
        response.render('info/ok', {results: results, id:id,user_id:user_id})
        var logger = log4js.getLogger('Article');
        logger.trace('Article enregistré Titre : '+titre);
    })
}
})


app.get('/articles/edit/:id(\\d+)', (request, response) => {
    var Article = require('./class/Article.js')
    var id = request.params.id;
    var moment = require('moment')
    moment.locale('fr');

    Article.one(id, function(err, data) {
        if(data.length == 0){
           response.send('cet article a ete supprime ou existe pas');
        }
        
        if (response.locals.authenticated && response.locals.userdata.id === data[0].posted_by) {
           response.render('articles/article_edit', {data: data, id:id, moment: moment})
        } else {
           response.redirect('/')
        }
    })
})


app.post('/articles/edit/:id(\\d+)', (request, response) => {
    var titre = request.body.titre
    var contenu = request.body.contenu
    var id = request.params.id;
    var Article = require('./class/Article.js')
    Article.update(titre,contenu,id, function(results){
        response.render('info/Article_modifier')
    })

})



app.get('/articles/delete/:id(\\d+)', (request, response) => {
    var Article = require('./class/Article.js')
    var id = request.params.id;
    var moment = require('moment')
    moment.locale('fr');

    Article.one(id, function(err, data) {
        if(data.length == 0){
            response.send('cet article a ete supprime ou existe pas');
        }
        var auth = (response.locals.authenticated && response.locals.userdata.id === data[0].posted_by)
          response.render('account/delete', {data: data, id:id, moment: moment, auth:auth})
    })
})

app.post('/articles/delete/:id(\\d+)', (request, response) => {
    var Article = require('./class/Article.js')
    var id = request.params.id;
  
    Article.one(id, function(err, data) {
        if(data.length == 0){
            response.send('cet article a deja ete supprime ou existe pas');
        }
      if (response.locals.authenticated && response.locals.userdata.id === data[0].posted_by) {
        Article.delete(id, function(err, data) {
            response.render('info/deleted', {data: data, id:id})
            var logger = log4js.getLogger('User');
            logger.trace("Article supprimé ID : "+id);
        })
    }else{
        response.send('delete')
    }
    })
})


app.use(function(req, res, next){
    res.status(404).render('error/error_not_found', {title: "Sorry, page not found"});
    var logger = log4js.getLogger('404');
    logger.error('Tentative d\'acces à la page base : '+ req.path);
});

app.listen(7532)
var logger = log4js.getLogger('Server');
logger.info('Server prêt');
