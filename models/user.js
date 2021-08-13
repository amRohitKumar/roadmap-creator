const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    name: String,
    googleId: String,
    emaiId : {
        type: String,
        require: true,
        unique: true,
    },
    roadmaps : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Roadmap'
        }
    ]
})

UserSchema.plugin(passportLocalMongoose, {
    usernameUnique: false,
});

const User = mongoose.model('User', UserSchema);
module.exports = User;