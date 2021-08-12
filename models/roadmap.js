const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roadmapSchema = new Schema({
    title: String,
    description : String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
module.exports = Roadmap;