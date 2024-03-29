const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const publicRoadmapSchema = new Schema({
    title: String,
    description : String,
    password: String,
    authorName: String,
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    section: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Publicsection'
        }
    ],
    participants : [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

const Publicroadmap = mongoose.model('Publicroadmap', publicRoadmapSchema);
module.exports = Publicroadmap;