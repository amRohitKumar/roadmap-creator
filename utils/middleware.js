const Publicroadmap = require("../models/publicRoadmap");
const catchAsync = require("./catchAsync");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', "You must be signed in first !");
        return res.redirect('/login');
    }
    else{
        next();
    }
}

module.exports.roadmapAuthor = catchAsync(async (req, res, next) => {
    const currUserId = req.user._id;
    const {roadmapId} = req.params;
    const reqRoadmap = await Publicroadmap.findById(roadmapId);
    const authorId = (reqRoadmap.author).toString();
    if(authorId == currUserId){
        next();
    }
    else{
        req.flash("You are not authorized !");
        res.send('/public');
    }
})