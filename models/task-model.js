const { Schema, model, Types } = require('mongoose');
const Category = require('./category-model');
const User = require('./user-model');

const taskSchema = new Schema({
    //Schema en db
    name : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        trim : true
    },
    categoryId : {
        type : Types.ObjectId,
        ref : Category,
        required : true
    },
    senderUserId : {
        type : Types.ObjectId,
        ref : User,
        required : true
    },
    receiverUserId : {
        type : Types.ObjectId,
        ref : User,
        required : true
    },
    expectedEndingDate : {
        type : String,
        required : false,
    },
    status : {
        type : String,
        enum : ['Created', 'Pending', 'Done'],
        default : 'Created',
        required : true,
    }
}, {
    // Les options
    collection : 'Task',
    timestamps : true
});

const Task = model('Task', taskSchema);

module.exports = Task;