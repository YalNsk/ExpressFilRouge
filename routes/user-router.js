const userController = require('../controllers/user-controller');
const authentication = require('../middlewares/auth-jwt-middleware');
const bodyValidation = require('../middlewares/body-validation');
const idValidator = require('../middlewares/idValidator');
const userValidator = require('../validators/user-validator');

const userRouter = require('express').Router()

userRouter.route('/')
    .get(userController.getAll) 
userRouter.route('/:id')
    .get(authentication(), authentication(), idValidator(), userController.getByID)
    .put(authentication(["Admin"]), idValidator(), bodyValidation(userValidator) , userController.update)
    .delete(authentication(["Admin"]), idValidator(), userController.delete)

module.exports = userRouter;