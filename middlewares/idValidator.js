const mongoose = require("mongoose");

const idValidator = () => {
    return (req, res, next) => {
        //On récupère l'id de la requête
        const id = req.params.id;
        //Si l'id n'est pas un ObjectId valide..
        if(!mongoose.isValidObjectId(id))
        {
            //On renvoie une erreur 400
            res.sendStatus(400); //Bad Request => La requête n'est pas bonne
            return;
        }
        //Sinon, on continue la requête grâce au next()
        next();
    }
}

//On exporte notre fonction idValidator
module.exports = idValidator;