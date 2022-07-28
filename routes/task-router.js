const taskController = require("../controllers/task-controller");
const bodyValidation = require("../middlewares/body-validation");
const idValidator = require("../middlewares/idValidator");
const { insertTaskValidator, updateTaskValidator} = require("../validators/task-validator");

const taskRouter = require("express").Router();

taskRouter.route('/')
    .get(taskController.getAll)
    .post(bodyValidation(insertTaskValidator), taskController.create)
taskRouter.route('/:id')
    .get(idValidator(), taskController.getById)
    .put(idValidator(), bodyValidation(updateTaskValidator) , taskController.update)
    .delete(idValidator(), taskController.delete)
taskRouter.route('/category/:id')
    .get(taskController.getByCategory)
taskRouter.route('/user/:id')
    .get(taskController.getByUser)

module.exports = taskRouter;