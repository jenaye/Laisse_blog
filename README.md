# Laisse_blog #
A simple blog in NodeJS

![alt tag](http://jenaye.fr/homepage.png)

## Librairies ##

![](https://img.shields.io/badge/Nodejs-6%2B-green.svg)

![](https://img.shields.io/badge/Express-2.11.1-blue.svg)

![](https://img.shields.io/badge/mysql-2.11.1-green.svg)

![](https://img.shields.io/badge/Ejs-2.5.1-orange.svg)

## Installation : ##

```
git clone https://github.com/jenaye/Laisse_blog.git
npm init (pour la creation du package.json)
```

## Run ##

```
cd Laisse_blog
node server.js
```
You can use nodemon too.

Example of informations given by the server when it runs.

![screen_of_the_shell](http://jenaye.fr/console.png)

By default the server runs on the 7532 port.
If you want to change it, just go to server.js and change this line (371) :

```
app.listen(7532)
// to
app.listen(your_port)
```

Hope you enjoy ! 
