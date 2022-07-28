const Task = require("../models/task-model");

const taskController = {
    //Tous les getter
    getAll : async (req, res) => {
        // Pour récupérer le offset et le limit passés dans la requête : 
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 10;

        // Pour la possible query avec le status : 
        let statusFilter;
        const status = req.query.status;
        if(status){
            // Si notre statut est un tableau (contient plusieurs status à évaluer)
            if(Array.isArray(status)){
            // Puisqu'on a un tableau on va regarder si le status de chaque requête a une valeur compris dans le tableau fourni
                statusFilter = { status : {$in : status}}
            }
            else {
                statusFilter = { status : status }
            }
        }
        else{
            statusFilter = {}
        }
        
        const tasks = await Task.find(statusFilter)
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
            })
            .limit(limit)
            .skip(offset);

        const count = await Task.countDocuments();
        const data = {'tasks' : tasks, 'count' : count };
        res.status(200).json(data);
    },
    // En fonction de l'Id de la tâche
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

        let statusFilter;
        const status = req.query.status;
        if(status){
            // Si notre statut est un tableau (contient plusieurs status à évaluer)
            if(Array.isArray(status)){
            // Puisqu'on a un tableau on va regarder si le status de chaque requête a une valeur compris dans le tableau fourni
                statusFilter = { status : {$in : status}}
            }
            else {
                statusFilter = { status : status }
            }
        }
        else{
            statusFilter = {}
        }

        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 10;
// On veut les tâches dont le champ categoryId est égal à l'id passé en paramètre
        const idCat = req.params.id;
        const categoryFilter = { categoryId : idCat };
        const tasks = await Task.find({$and : [categoryFilter, statusFilter]})
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
            })
            .limit(limit)
            .skip(offset);

        const count = await Task.countDocuments(categoryFilter);
        const data = {'tasks' : tasks, 'count' : count };
        res.status(200).json(data);
    },
    getByUser : async (req, res) => {

        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 10;

        const idReceiver = req.params.id;
        const receiverFilter = { receiverUserId : idReceiver };
        const tasks = await Task.find({$and : [receiverFilter, statusFilter]})
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
            })
            .limit(limit)
            .skip(offset);

        const count = await Task.countDocuments();
        const data = {'tasks' : tasks, 'count' : count };
        res.status(200).json(data);

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