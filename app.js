// //Pour utiliser dotenv, on doit l'importer
// let dotenv = require("dotenv-flow");
// //Pour charger tous nos fichiers .env.*
// dotenv.config()
//Puisqu'on ne va plus utiliser la variable dotenv par la suite, on peut directement faire le .config sur l'import
//  /!\ Attention, la config de l'environnement devra toujours être faite au tout début du programme
require('dotenv-flow').config();

//console.log(process.env);
//On extrait de process.env, les variables d'environnement dont on aura besoin par la suite
const { MESSAGE, NODE_ENV, PORT, DB_CONNECTION } = process.env;
console.log(DB_CONNECTION);
console.log('Lancé en', NODE_ENV, ' : ', MESSAGE);

//Import du module mongoose
const mongoose = require('mongoose');

//Création d'un serveur Express :
//1) Toujours faire en premier : importer le module express et le stocker dans une variable
const express = require('express');
//On importe la librairie qui gère les erreurs async await (à mettre avant require(lesroutes))
require('express-async-errors');
//On importe notre module router présent dans index.js en important tout le dossier routes
const router = require('./routes');

//On crée le serveur et on le stocke dans une variable
const app = express();

//#region route temporaire
//pour vérifier que notre application express fonctionnait bien avant de faire un routing tout propre 
//Mise en place d'une route temporaire
// app.get('/user', (req, res) => {
//     const data = {
//         msg : 'Coucou'
//     }
//     res.json(data);
// })
//#endregion

//Ajout d'un middleware pour permettre à notre serveur de lire des objets json en post
// /!\ A mettre en premier middleware
app.use(express.json());

//On indique à notre app que pour chaque requête, elle doit l'intercepter
//On doit capturer la requête avant d'utiliser le middleware qui dispatch vers nos routes: 
    //Elle doit donc se trouver avant /!\
app.use(async(req, res, next) => {
    //On attend que la connection à la bdd soit établie
    await mongoose.connect(DB_CONNECTION);
    console.log("Connexion réussie !");
    //Une fois qu'elle est correctement établie, on passe à la suite de la requête
    next();
})

//On indique à notre serveur, qu'à l'arrivée sur la route /api, il doit utiliser notre module router
app.use('/api', router);

//On met le server sur "écoute" sur le port préciser dans la variable d'environnement PORT
app.listen(PORT, () => {
    console.log(`Server up on port:${PORT} [${NODE_ENV}]`);
})






//////////////// UTILS ///////////
// https://ihateregex.io/
// cross-env
// https://www.npmjs.com/package/cross-env
// Nous permettra d'utiliser et set notre environnement 
// comme étant en production ou developpement

// pour l'installer :
// npm i --save cross-env

// dotenv-flow
// https://www.npmjs.com/package/dotenv-flow
// Nous permettra de créer des fichiers d'environnement
// dans lesquels nous allons stockers différentes 
// constantes utiles à notre projet :
//  la connection à notre DB
//  le port
//  les infos pour créer notre JWT

// pour l'installer :
// npm i --save dotenv-flow

// (si vous souhaitez installer les deux en même temps :
// npm i --s cross-env dotenv-flow)

// pour gérer les erreurs possibles avec le async await dans express on va installer le module 
// express-async-errors
// https://www.npmjs.com/package/express-async-errors


// Pour travailler avec mongoDB dans notre projet express, on aura besoin
// de Mongoose 
// https://www.npmjs.com/package/mongoose
// https://mongoosejs.com/docs/guide.html


// Pour les curieux : 
// Si un jour, vous souhaitez faire un projet avec du SQL
// https://www.npmjs.com/package/sequelize
// https://sequelize.org/
   

//Hashage password :
// https://www.npmjs.com/package/argon2

//////////////// JWT /////////////
// https://www.npmjs.com/package/jsonwebtoken

// Générateur de password //
// https://www.lastpass.com/fr/features/password-generator

// https://swagger.io/docs/specification/authentication/bearer-authentication/