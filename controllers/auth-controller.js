//auth -> raccourcis pour authentication -> identification

const User = require('../models/user-model');
//On importe notre utilitaire pour pouvoir générer un token
const jwtUtils = require('../utils/jwt-utils');
//On importe argon2
const argon2 = require('argon2');


const authController = {
    login : async (req, res) => {
        //Pour se loger, on va recevoir un identifiant et un mdp 
        //et on va devoir vérifier si un utilisateur correspond à ces données
        //req.body va contenir un objet qui ressemble à ceci :
        // {
        //     "credential" : "monIdentifiant"; //monIdentifiant pourra être soit un pseudo, soit un email
        //     "password" : "monPassword"
        // }
        const { credential, password } = req.body;
        //On construit notre filtre : on recherche l'utilisateur dont l'email correspond à la valeur dans credential
        //OU son pseudo correspond à la valeur dans credential
        const credentialFilter = { $or : [{email : credential}, { pseudo : credential} ] }
        const user = await User.findOne(credentialFilter);
        //On vérifie si on a récupérer un utilisateur
        if(!user){
            //Si pas
            return res.status(401).json({ error : 'Bad credentials' })  //401 -> Unauthorized -> Pas les bonnes infos de login
        }
        //Si on a un utilisateur, on doit vérifier si son mdp présent dans le req.body correspond au mdp hash en bdd
        const isPassWordValid = await argon2.verify(user.password, password );
        //Si le mot de passe de la requête et celui en bdd ne correspondent pas 
        if(!isPassWordValid)
        {
            //Erreur
            return res.status(401).json({ error : 'Bad credentials' })
        }
        //TODO : générer et renvoyer un token
        const token = await jwtUtils.generate(user);
        return res.json({token});
    },
    register : async (req, res) => {
        //Pour enregistrer un nouvel utilisateur, on ne pas stocker son mot de passe en clair dans la base de données
        //On va donc devoir le hash à l'aide d'un petit module fort pratique

        //On récupère dans le body, toutes les informations qui nous interessent pour faire un nouvel utilisateur
        const { pseudo, email, lastname, firstname, password } = req.body;

        //Hashage du password
        const hashedPassword = await argon2.hash(password);

        //On crée un nouvel utilisateur à rentrer en db à partir des infos sur req.body
        //SAUF LE PASSWORD qu'on ne stocke jamais en clair, on va stocker le password hashé.
        const userToInsert = User({
            pseudo,
            email,
            lastname,
            firstname,
            password : hashedPassword //Pour le password de notre user à insérer en db, on fourni le password une fois hashé
        });
        await userToInsert.save();
        const token = await jwtUtils.generate(userToInsert);
        res.status(200).json({token});
    }
}

module.exports = authController;