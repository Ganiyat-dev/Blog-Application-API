const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('Post', postSchema);