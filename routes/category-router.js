//On importe le module express
const express = require('express');
//A partir de la méthode Router(), on construit un nouveau router qu'on appelle categoryRouter
const categoryRouter = express.Router();

//Ou plus rapide en une ligne vu que l'import d'express nous sert juste à appeler la méthode Router() qui construit notre route
//const categoryRouter = require('express').Router()

//Import du controller category
const categoryController = require('../controllers/category-controller');
const authentication = require('../middlewares/auth-jwt-middleware');
const bodyValidation = require('../middlewares/body-validation');
const idValidator = require('../middlewares/idValidator');
const categoryValidator = require('../validators/category-validator');

//Configuration des différentes routes
//2 Méthodes

//localhost:8080/category/
//localhost:8080/category/1

//Méthode get : Récupération de données
//Pour insérer un middleware avec cette méthode :
// nomRouteur.method('route', middleware(), callback);
// categoryRouter.get('/', categoryController.getAll)
// categoryRouter.get('/:id', idValidator(),  categoryController.getById)
// //Méthode post : Ajout d'un nouvel élément
// categoryRouter.post('/', authentication(), bodyValidation(categoryValidator), categoryController.create)
// //Méthode put : Modification d'un élément en particulier
// categoryRouter.put('/:id', idValidator(), categoryController.update)
// //Méthode delete : Suppression d'un élément en particulier
// categoryRouter.delete('/:id', idValidator(), categoryController.delete)

////////////////// ↓ VERSUS ↑ //////////////////

//On peut remarquer que les routes '/' et '/:id' se répètent mais avec différentes méthodes (get, put, post, delete)
//Il existe une écriture raccourcie pour définir les routes 
// categoryRouter.use(idValidator());

categoryRouter.route('/')
    .get(categoryController.getAll) //Récupération de toutes les catégories
    .post(authentication(["User", "Moderator", "Admin"]),bodyValidation(categoryValidator), categoryController.create) //Ajout d'une nouvelle catégorie
    
//On rajoute notre middleware de validation de format de l'Id pour chaque route où on a besoin
//de valider l'id
categoryRouter.route('/:id')
    .get(idValidator(), categoryController.getById) //Récupération d'une catégorie en particulier
    .put(authentication(["Admin", "Moderator"]), idValidator(), bodyValidation(categoryValidator), categoryController.update) //Modification d'une catégorie
    .delete(authentication(["Admin"]), idValidator(), categoryController.delete); //Suppresion d'une catégorie

//On exporte notre router ainsi crée et configuré
module.exports = categoryRouter;