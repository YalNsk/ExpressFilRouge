const UserDTO = require("../dto/user-dto");
const User = require("../models/user-model");

//Fonction de mappage d'un user de DB en user DTO afin de retirer le password et le role
//Comme nous avons à faire plusieurs fois cette action, pour ne pas faire de répétition, on vient le faire dans une fonction
const userMapperToDTO = (user) => new UserDTO(user.id, user.email, user.pseudo, user.firstname, user.lastname);

const userController = {
    getAll : async (req, res) => {
        const users = await User.find();
        //On a récupéré les utilisateurs de la bdd MAIS on récupère aussi tous les password hashé
        // /!\ Pas top le password :'(

        //On va transformer les utilisateurs de la db avec password en UserDTO qui est un User sans password (et role)
        //const usersAvecLastNameEnMaj = users.map(user => user.lastname.toUpppercase())
        const usersDTO = users.map(userMapperToDTO);        
        res.status(200).json(usersDTO);
    },
    getByID : async (req, res) => {
        //On récupère dans la requête, l'id dans les paramètres
        const id = req.params.id;
        //On fait la requête pour récupérer l'utilisateur avec cet id
        const user = await User.findById(id);
        //On vérifie qu'on a bien récupéré un utilisateur
        //Si pas trouvé, erreur 404
        if(!user){
            return res.sendStatus(404) //NotFound -> élément non trouvé
        }
        //Si trouvé : On doit le transformer en userDTO avant de le renvoyer
        const userDTO = userMapperToDTO(user);
        res.status(200).json(userDTO);
    },
    update : async (req, res) => {
        //On a besoin de récupérer l'id de l'utilisateur qu'on veut modifier
        const id = req.params.id;

        const { pseudo , email, firstname, lastname } = req.body
        //On appelle la fonction qui permet de trouver l'élément via son id et de le modifier
        //La fonction findByIdAndUpdate prend : 
            //en premier paramètre, l'id à trouver
            //en deuxième paramètre, un objet qui contient les propriétés qu'on souhaite modifier
            //en troisième paramètre, un objet qui contient les options qu'on souhaite ajouter
        //l'option returnDocument : 'after' nous permet de récupéré l'utilisateur APRES sa modification et non avant
        //(ce qui est le comportement par défaut)
        const userUpdated = await User.findByIdAndUpdate(id, {
            pseudo,
            email,
            firstname,
            lastname
        }, { returnDocument: 'after' });

        //On vérifie si notre id était existant
        if(!userUpdated)
        {
            return res.sendStatus(404);
        }
        //Deux choix, soit on envoie juste un statut 200
        //res.sendStatus(200);
        //Soit, on doit transformer notre userUpdated qui contient password + role en userDTO qui ne les contient pas
        const userDTO = userMapperToDTO(userUpdated);
        res.status(200).json(userDTO);
    },
    delete : async (req, res) => {
        //On a besoin de récupérer l'id de l'élément à supprimer
        const id = req.params.id;

        //On essaie de récupérer l'élément en db et de le supprimer
        //La fonction findByIdAndDelete renvoie l'utilisateur trouvé si id ok, sinon renvoie null
        const userToDelete = await User.findByIdAndDelete(id);
        
        //On vérifie si on a bien récupéré un userToDelete
        if(!userToDelete){
            return res.sendStatus(404); //NotFound -> id
        }
        res.sendStatus(204); //Tout s'est bien passé, id trouvé, plus suppression faite \o/
    }
}

module.exports = userController;