const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Subsection = require('./subsection')
const SectionSchema = new Schema({
    heading : String,
    duration: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    subsections : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Subsection'
        }
    ]
})

SectionSchema.post('findOneAndDelete', async function(section){
    if(section.subsections.length){
        const resRemoved = await Subsection.deleteMany({_id: {$in: section.subsections}})
        console.log(resRemoved);
    }
})

const Section = mongoose.model('Section', SectionSchema);
module.exports = Section;