const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subSectionSchema = new Schema({
    heading : String,
    linkText: String,
    status: Boolean,
    userId: String,
    copmpletedCount: Number,
    totalUserCount: Number
})

const Subsection = mongoose.model('Subsection', subSectionSchema);
module.exports = Subsection;