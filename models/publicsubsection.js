const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const publicSubSectionSchema = new Schema({
    heading : String,
    link: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    completed: [
        {
            type:Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
})

const Publicsubsection = mongoose.model('Publicsubsection', publicSubSectionSchema);
module.exports = Publicsubsection;