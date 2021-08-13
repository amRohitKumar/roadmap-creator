const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roadmapSchema = new Schema({
    title: String,
    description : String,
    authorName: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    section: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Section'
        }
    ]
})

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
module.exports = Roadmap;