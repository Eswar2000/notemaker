const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define structure to user collection
const noteSchema = new Schema({
    type: {
        type: String,
        enum: ['default', 'list'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
    },
    body: {
        type: String,
    },
    menu: {
        type: [String],
    },
    menuChecked: {
        type: [String],
    },
    owner: {
        type: String,
        required: true
    }, 
    shared: {
        type: [String],
    }
}, {timestamps: true});

// Model - structure of data from database
const note = mongoose.model('note', noteSchema);
module.exports = note;