const taskController = require("../controllers/task-controller");
const authentication = require("../middlewares/auth-jwt-middleware");
const bodyValidation = require("../middlewares/body-validation");
const idValidator = require("../middlewares/idValidator");
const { insertTaskValidator, updateTaskValidator} = require("../validators/task-validator");

const taskRouter = require("express").Router();

taskRouter.route('/')
    .get(authentication(), taskController.getAll)
    .post(authentication(), bodyValidation(insertTaskValidator), taskController.create)
taskRouter.route('/:id')
    .get(authentication(), idValidator(), taskController.getById)
    .put(authentication(), idValidator(), bodyValidation(updateTaskValidator) , taskController.update)
    .delete(authentication(['Admin']), idValidator(), taskController.delete) //Etre connect en tant qu'admin
taskRouter.route(authentication(), '/category/:id')
    .get(taskController.getByCategory)
taskRouter.route(authentication(), '/user/:id')
    .get(taskController.getByUser)

module.exports = taskRouter;