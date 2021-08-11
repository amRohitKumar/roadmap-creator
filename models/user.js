const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    googleId: String,
    emaiId : {
        type: String,
        require: true,
        unique: true,
    }
})

const User = mongoose.model('User', UserSchema);
module.exports = User;