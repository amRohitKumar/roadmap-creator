const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subSectionSchema = new Schema({
    heading : String,
    status: Boolean
})

const Subsection = mongoose.model('Subsection', subSectionSchema);
module.exports = Subsection;