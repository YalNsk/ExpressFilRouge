
const bodyValidation = (yupValidator) => {
    return async (req, res, next) => {
        //On essaie de passer la validation
        try {
            //req.body contient l'objet json qu'on essaie d'insérer ou de modifier (en post ou put)
            //Au moment de la requête, le req.body contient par ex :
            // { "nom" : "nomCategory",
            //   "icon" : "🛹",
            //     "patate" : "oui"}
            //Si on arrive ici depuis la route /api/category/ :
            //yupValidator contient notre categoryValidator, donc on va déclencher la validation
            //sur notre categoryValidator
            //const validData = await categoryValidator.noUnknown().validate(req.body, { abortEarly : false});
            const validData = await yupValidator.noUnknown().validate(req.body, { abortEarly : false});
            //On remplace req.body qui contient potentiellement des données en plus que ce que l'on souhaite
            //par validData, qui a été nettoyé des données qu'on ne souhaite pas insérer
            //Après la validation + la méthode noUnknown, validData contient :
            // { "nom" : "nomCategory",
            //   "icon" : "🛹"}
            //Par contre req.body lui, contient toujours une valeur pour patate, 
            //on remplace donc le body de la request par validData
            req.body = validData;
            //On continue la requête
            next();
        }
        //Si on a une erreur : on reverra bad request
        catch(e) {
            console.log(e);
            return res.sendStatus(400); //Bad Request
        }
    }

}

module.exports = bodyValidation;