const Task = require("../models/task-model");

const taskController = {
    //Tous les getter
    getAll : async (req, res) => {
        const tasks = await Task.find()
            .populate({           
                path : 'categoryId',
                select : { name : 1, icon : 1 }
            })
            .populate({
                path : 'senderUserId',
                select : {firstname : 1, lastname : 1, pseudo : 1}
            })
            .populate({
                path : 'receiverUserId',
                select : {firstname : 1, lastname : 1, pseudo : 1}
            });
        res.status(200).json(tasks);
    },
    getById : async (req, res) => {
        const id = req.params.id
        const task = await Task.findById(id)

            .populate({           
                path : 'categoryId',
                select : { name : 1, icon : 1 }
            })
            .populate({
                path : 'senderUserId',
                select : {firstname : 1, lastname : 1, pseudo : 1}
            })
            .populate({
                path : 'receiverUserId',
                select : {firstname : 1, lastname : 1, pseudo : 1}
            });

            if(!task){
                return res.sendStatus(404); //Not found
            }

            res.status(200).json(task);
    },


    getByCategory : async (req, res) => {
// On veut les tâches dont le champ categoryId est égal à l'id passé en paramètre
        const idCat = req.params.id;
        const categoryFilter = { categoryId : idCat };
        const tasks = await Task.find(categoryFilter)
            .populate({           
                path : 'categoryId',
                select : { name : 1, icon : 1 }
            })
            .populate({
                path : 'senderUserId',
                select : {firstname : 1, lastname : 1, pseudo : 1}
            })
            .populate({
                path : 'receiverUserId',
                select : {firstname : 1, lastname : 1, pseudo : 1}
            });
        res.status(200).json(tasks);
    },
    getByUser : async (req, res) => {
        const idReceiver = req.params.id;
        const receiverFilter = { receiverUserId : idReceiver };
        const tasks = await Task.find(receiverFilter)
            .populate({           
                path : 'categoryId',
                select : { name : 1, icon : 1 }
            })
            .populate({
                path : 'senderUserId',
                select : {firstname : 1, lastname : 1, pseudo : 1}
            })
            .populate({
                path : 'receiverUserId',
                select : {firstname : 1, lastname : 1, pseudo : 1}
            });
        res.status(200).json(tasks);

    }, 
    //Creation
    create : async (req, res) => {
        const taskToAdd = Task(req.body);
        await taskToAdd.save();
        res.status(200).json(taskToAdd);
    },
    //Modification
    update : async (req, res) => {
        const id = req.params.id;
        const {name, description, categoryId, receiverUserId, status, expectedEndingDate } = req.body;
        const taskUpdated = await Task.findByIdAndUpdate(id, {
            name,
            categoryId,
            receiverUserId,
            status,
            description : description? description : null,
            expectedEndingDate : expectedEndingDate? expectedEndingDate : null
        }, { returnDocument : 'after'});
        if(!taskUpdated){
            return res.sendStatus(404); //Not found
        }
        res.sendStatus(204);
    },
    //Suppression
    delete : async (req, res) => {
        const id = req.params.id;
        const taskToDelete = await Task.findByIdAndDelete(id);
        if(!taskToDelete) {
            return res.sendStatus(404); //Not found
        }
        res.sendStatus(204);
    }
}

module.exports = taskController;