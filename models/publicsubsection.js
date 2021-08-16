const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const publicSubSectionSchema = new Schema({
    heading : String,
    linkText: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    copmpletedCount: Number,
    totalUserCount: Number
})

const Publicsubsection = mongoose.model('Publicsubsection', publicSubSectionSchema);
module.exports = Publicsubsection;