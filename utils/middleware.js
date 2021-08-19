const Publicroadmap = require("../models/publicRoadmap");
const catchAsync = require("./catchAsync");
const ExpressError = require('../utils/ExpressError');
const Roadmap = require("../models/roadmap");

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
    if(!reqRoadmap){
        return new ExpressError("You are not authorized !", 500);
    }
    const authorId = (reqRoadmap.author).toString();
    if(authorId == currUserId){
        next();
    }
    else{
        req.flash("You are not authorized !");
        res.send('/public');
    }
})

module.exports.privateRoadmapAuthor = catchAsync( async(req, res, next) => {
    const currUserId = req.user._id;
    const {roadmapId} = req.params;
    const reqRoadmap = await Roadmap.findById(roadmapId);
    if(!roadmapId){
        return new ExpressError("No roamdap found !");
    }
    const authorId = (reqRoadmap.author).toString();
    if(authorId == currUserId){
        next();
    }
    else{
        req.flash("You are not authorized !");
        res.send('/private');
    }
})