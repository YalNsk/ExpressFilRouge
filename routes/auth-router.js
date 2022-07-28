const authController = require('../controllers/auth-controller');
const bodyValidation = require('../middlewares/body-validation');
const { registerValidator, loginValidator } = require('../validators/auth-validator');

const authRouter = require('express').Router();

authRouter.post('/login', bodyValidation(loginValidator), authController.login);
///// ou /////
// authRouter.route('/login')
//     .post(authController.login);

authRouter.post('/register', bodyValidation(registerValidator), authController.register);
//// ou ////
// authRouter.route('/register')
//     .post(authController.register);

module.exports = authRouter;