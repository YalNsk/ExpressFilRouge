const yup = require('yup');

//Regex qui vérifie que le mdt contient au moins un chiffre, une lettre minuscule, une lettre majuscule et un caractère spécial
const pwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W|_]).+$/;

//\w -> word character a-z, A-Z, 0-9, _
//\W -> non word character !a-z !A-Z !0-9 !_ 

//On crée le model de validation pour le body du register
//Ex : 
// {
// 	"pseudo" : "Lhel",
// 	"email" : "aude.beurive@bstorm.be",
// 	"firstname" : "Aude",
// 	"lastname" : "Beurive",
// 	"password" : "1234-po"
// }
const registerValidator = yup.object({
    pseudo : yup.string().trim().required().min(3).max(50),
    email : yup.string().trim().email().required().max(255),
    firstname : yup.string().trim().required().max(150),
    lastname : yup.string().trim().required().max(150),
    password : yup.string().required().min(8).max(64).matches(pwdRegex)
});

//On crée le model de validation pour le body du login
//Ex:
// {
//     "credential": "Lhel",
//     "password" : "1234-po"
// }
const loginValidator = yup.object({
    credential : yup.string().trim().required().max(255),
    password : yup.string().required()
});

module.exports = { registerValidator, loginValidator}