const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a new Schema that describes what key-value pairs each kitten document has
const messageSchema = new Schema({
    date_created: {
        type: Date,
        required: true,
        default: new Date()
    },
    comment: {
        type: String,
        required: true,
    },
    chatroomId: {
        type: String,
        required: true
    },
    sender: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    receiver: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Message', messageSchema)