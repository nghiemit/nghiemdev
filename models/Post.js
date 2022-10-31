const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchame = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    url: {
        type: String,
    },
    status: {
        type: String,
        enum: ['TO LEARN', 'LEARNING', 'LEARNED']
    },
    user: {
        type: Schema.Types.ObjectId,
        // nối với bảng user
        ref: 'users'
    }
})
module.exports = mongoose.model('posts', PostSchame)