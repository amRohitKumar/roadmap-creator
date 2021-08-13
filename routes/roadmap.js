const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Roadmap = require('../models/roadmap');
const {DateAndMonth} = require('../utils/helperFunction');
const catchAsync = require('../utils/catchAsync');

router.get('/:userId', catchAsync(async (req, res) => {
    const {userId} = req.params;
    const reqUser = await User.findById(userId).populate({
        path: 'roadmaps',
    })

    if(!reqUser){
        req.flash('error', "Can't able to find the user !");
        return res.redirect('/');
    }
    res.render('roadmap/homepage', {reqUser});
}))

router.post('/:userId/create', catchAsync(async (req, res) => {
    const {title, description} = req.body;
    const {userId} = req.params;
    const author = req.user.name;
    const currentDate = DateAndMonth();
    const reqUser = await User.findById(userId);
    const newRoadmap = new Roadmap({title, description, author: userId, authorName: author});
    await newRoadmap.save();
    reqUser.roadmaps.push(newRoadmap._id);
    await reqUser.save();
    req.flash('success', "Added new Roadmap !");
    res.redirect(`/${userId}/rp/${newRoadmap._id}`);
}))


router.get('/:userId/rp/:roadmapId', catchAsync(async (req, res) => {
    // res.send("you got me");
    const {roadmapId} = req.params;
    const reqRoadmap = await Roadmap.findById(roadmapId).populate({
        path: 'section'
    })
    res.render('roadmap/show', {reqRoadmap});
}))











module.exports = router;