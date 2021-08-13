const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
    heading : String,
    duration: Number,
    subsections : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Subsection'
        }
    ]
})

const Section = mongoose.model('Section', SectionSchema);
module.exports = Section;