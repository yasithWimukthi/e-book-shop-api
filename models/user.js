const mongoose = require('mongoose');
// const crypto = require('crypto');
// const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    about:{
        type : String,
        trim: true
    },
    salt : String,
    role :{
        type : Number,
        default : 0
    },
    history:{
        type : Array,
        default : []
    }
},{timestamps:true});


module.exports = mongoose.model('User', userSchema);