const User = require('../models/user-model');
const jwtUtils = require('../utils/jwt-utils');

//roles sera un tableau qui contient tous les roles qui ont accès à la route
const authentication = ( roles /*options*/) => {
    return async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        // console.log(req.headers['content-type']);
        //On récupère dans le header, la valeur pour la propriété authorization
            //On récupère une chaine de caractère qui contient "Bearer letokentrestreslongavecpleindechiffresetdelettresetc"
            //Si on veut récupérer seulement le token, on va devoir utiliser le split pour récup seulement lui

        //authHeader, si pas de token passé dans les header, sera null
        //On doit donc vérifier qu'il n'est pas null avant de faire le split ou non dessus
        const token = authHeader ? authHeader.split(' ')[1] : false;
        //const token = authHeader && authHeader.split(' ')[1]; //Fait la même chose qu'au dessus mais en plus court

        //Si nous n'avons pas récupéré de token

        if(!token){
            return res.sendStatus(401) //Unauthorized (-> Nous ne sommes pas autorisés à accéder à cette route)
        }

        //Si on a un token, on va devoir le décoder
        let decodedToken;
        try{
            decodedToken = await jwtUtils.decode(token);
            //Si le décodage fonction, decotedToken ressemble à ceci 
            // decodedToken = {
            //     id : "216528c949a94f",
            //     pseudo : "Oui-oui",
            //     role : "User"
            // }
        }
        catch(error){
            return res.sendStatus(403) //Forbidden 
        }

        //Si on a réussi à le décoder, on valide les éventuelles options passées en paramètre
        //On vérifie si on a reçu un tableau de rôles
        if(roles){
            //On va vérifier en base de données si l'utilisateur à un des roles présents dans notre tableau
            //On vérifie toujours en DB et pas dans le decodedToken au cas où le rôle de la personne a été changé
            //depuis sa dernière connection.
            //On récupère l'utilisateur connecté dans la bdd
            const userDB = await User.findById(decodedToken.id);
            //On récupère son role
            const userDBRole = userDB.role;
            //const userDBRole = await User.findById(decodedToken).role;

            if(!roles.includes(userDBRole))
            {
                return res.sendStatus(403); //Forbidden (nous n'avons pas les droits)
            }
        }

        req.user = decodedToken;
        next();
    }
}

module.exports = authentication;