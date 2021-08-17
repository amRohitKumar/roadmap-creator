const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Publicsubsection = require('./publicsubsection');

const publicSectionSchema = new Schema({
    heading : String,
    duration: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    subsections : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Publicsubsection'
        }
    ]
})

publicSectionSchema.post('findOneAndDelete', async function(publicSection){
    if(publicSection.subsections.length){
        const resRemoved = await Publicsubsection.deleteMany({_id: {$in: publicSection.subsections}})
        // console.log(resRemoved);
    }
})

const Publicsection = mongoose.model('Publicsection', publicSectionSchema);
module.exports = Publicsection;