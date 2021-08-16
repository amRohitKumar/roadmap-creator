const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subSectionSchema = new Schema({
    heading : String,
    linkText: String,
    status: Boolean,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})

// subSectionSchema.post('')

const Subsection = mongoose.model('Subsection', subSectionSchema);
module.exports = Subsection;