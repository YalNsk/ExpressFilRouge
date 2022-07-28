const { Schema, model  } = require('mongoose');

//On crée le Schema d'une catégorie, c'est à dire, ce à quoi, une catégorie devrait ressembler en DB
    //Le nom de catégorie est une chaine de caractère, unique, requise et nettoyée des espaces blancs à gauche et à droite
    //L'icon de catégorie est une chaine de caractère, requise et nettoyée des espaces blancs à gauche et à droite
//new Schema({ description des champs, leurs types, etc}, { options sur l'entiereté d'une categorie})
const categorySchema = new Schema({
    name : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    icon : {
        type: String,
        required : true,
        trim : true
    }
}, {
    //Pour indiquer en BDD dans quelle collection on retrouve les catégories
    collection : 'Category',
    //Sauvegardera la date de création et dernière date de modification en bdd
    timestamps : true
});

//On génère un model à partir du schema qu'on a crée au dessus
const Category = model('Category', categorySchema);
module.exports = Category;
