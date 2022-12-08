const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ListTodos = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status:{
        type:Boolean,
    },
    category: {
        type: Schema.Types.ObjectId,
        // nối với bảng catrgory
        ref: 'totoCategory'
    }
})
module.exports = mongoose.model('listTodo', ListTodos)