const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
       
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        required: false
    },  
    password: {
        type: String,
        required: true
    }, 
    date: {
        type: Date,
        default: Date.now(), // todays date wrt server == GMT date
        required: false
    }
});

module.exports = mongoose.model("user", userSchema);