//On importe notre module jsonwebtoken
const jwt = require('jsonwebtoken');

const { JWT_AUDIENCE, JWT_ISSUER, JWT_SECRET } = process.env;

const jwtUtils = {
    //Fonction pour générer un token
    generate: ({ id, pseudo, role }) => {
        //Notre fonction generate, doit renvoyer une promesse 
        //pour qu'on puisse vérifier par la suite si notre génération est réussie
        return new Promise((resolve, reject) => {
            //On récupère nos données pour créer le payload
            const payload = { id, pseudo, role };

            //Création des options (du header)
            const options = {
                algorithm: 'HS512', //HS256
                expiresIn: '12h',
                audience: JWT_AUDIENCE,
                issuer: JWT_ISSUER
            }
            //Pour générérer un token, nous auront toujours besoin 
            //D'un header/options qui contient toutes les informations sur le token (type, algo, expiration, etc...)
            //D'un payload : Les données de l'utilisateur qu'on veut stocker dans le jeton /!\ JAMAIS DE PASSWORD
            //Le secret : Signature secrète détenue par l'api qui va nous permettre de générer et décoder notre token
            // /!\ Cette information ne doit jamais être mise en clair dans le code ni push sur un git 
            //sinon n'importe qui peut décoder notre jeton
            //jwt.sign('payload', 'secret', 'options/header', (error, token) => {})
            jwt.sign(payload, JWT_SECRET, options, (error, token) => {
                if (error) {
                    //Si notre génération de token a produit une erreur, on passe notre promesse en rejetée
                    return reject(error);
                }
                //Si la génération de token a fonctionné, on résoud la requête en fournissant le token généré
                resolve(token);
            })

        });
    },
    //Fonction pour décoder un token
    decode: (token) => {
        //Dans le cas où on n'a pas de token
        if (!token) {
            return Promise.reject(new Error('No Token'));
        }
        //Sinon on renvoie une promesse
        return new Promise((resolve, reject) => {
            //On crée les options pour faire notre décodage
            const options = {
                audience : JWT_AUDIENCE,
                issuer : JWT_ISSUER
            }
            // jwt.verify('token', 'secret', 'options/header', (error, payload) => {})
            // payload = data
            jwt.verify(token, JWT_SECRET , options, (error, payload) => {
                //Si on n'a pas réussi à décoder
                if(error){
                    return reject(error);
                }
                //Si on a réussi à décoder, on résoud la promesse en renvoyant le payload/les data
                resolve(payload);
            })

        });
    }
}

module.exports = jwtUtils;