const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define structure to user collection
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {timestamps: true});

// Model - structure of data from database
const user = mongoose.model('user', userSchema);
module.exports = user;