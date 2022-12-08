const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TodoCategory = new Schema({
    title: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        // nối với bảng user
        ref: 'users'
    }
})
module.exports = mongoose.model('todoCategory', TodoCategory)