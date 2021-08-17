const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Roadmap = require('../models/roadmap');
const Publicroadmap = require('../models/publicRoadmap');
const {DateAndMonth} = require('../utils/helperFunction');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, roadmapAuthor} = require('../utils/middleware');


router.get('/private', isLoggedIn ,catchAsync(async (req, res) => {
    const userId = req.user._id;
    const reqUser = await User.findById(userId).populate({
        path: 'roadmaps',
    })

    if(!reqUser){
        req.flash('error', "Can't able to find the user !");
        return res.redirect('/');
    }
    res.render('roadmap/homepage', {reqUser});
}))

router.get('/public', isLoggedIn, catchAsync( async (req, res) => {
    const userId = req.user._id;
    const reqUser = await User.findById(userId).populate({
        path: 'publicroadmaps',
    })

    if(!reqUser){
        req.flash('error', "Can't able to find the user !");
        return res.redirect('/');
    }
    // console.log("start", reqUser);
    res.render('roadmap/publicRoadmap', {reqUser});
}))

router.post('/private', isLoggedIn, catchAsync(async (req, res) => {
    const {title, description} = req.body;
    const userId = req.user._id;
    const author = req.user.name;
    const currentDate = DateAndMonth();
    const reqUser = await User.findById(userId);
    const newRoadmap = new Roadmap({title, description, author: userId, authorName: author});
    await newRoadmap.save();
    reqUser.roadmaps.push(newRoadmap);
    await reqUser.save();
    req.flash('success', "Added new Private Roadmap !");
    res.redirect(`/private`);
}))

router.post('/public', isLoggedIn, catchAsync(async (req, res) => {
    const {title, password, description} = req.body;
    const userId = req.user._id;
    const author = req.user.name;
    const currentDate = DateAndMonth();
    const reqUser = await User.findById(userId);
    const newRoadmap = new Publicroadmap({title, description, author: userId, authorName: author, password: password});
    await newRoadmap.save();
    reqUser.publicroadmaps.push(newRoadmap);
    await reqUser.save();
    req.flash('success', "Added new Public Roadmap !");
    res.redirect(`/public`);
}))

router.post('/join/public', isLoggedIn, catchAsync(async (req, res) => {
    const userId = req.user._id;
    const {uniqueId, password} = req.body;

    const reqPublicRoadmap = await Publicroadmap.findById(uniqueId);
    const authorId = (reqPublicRoadmap.author._id).toString();

    if(!reqPublicRoadmap){
        req.flash('error', "Word UniqueId or password ! Please try again .");
        res.redirect('/private');
    }
    else if(authorId == req.user._id){
        console.log('inside the if block');
        req.flash('error', "You can't join your own roadmap !");
        return res.redirect('/private');
    }
    if(reqPublicRoadmap.password === password){
        console.log('inside password block');
        const reqUser = await User.findById(userId);
        reqUser.publicroadmaps.push(reqPublicRoadmap);
        await reqUser.save();
        req.flash('success', "Roadmap added !");
        res.redirect('/public');
    }
    else{
        req.flash('error', "Wrong UniqueId or password ! Please try again .");
        res.redirect('/public');
    }

}))

router.get('/privaterp/:roadmapId', isLoggedIn, catchAsync(async (req, res) => {
    const {roadmapId} = req.params;
    const reqRoadmap = await Roadmap.findById(roadmapId).populate({
        path: 'section'
    })
    res.render('roadmap/show', {reqRoadmap});
}))

router.get('/publicrp/:roadmapId', isLoggedIn, catchAsync(async (req, res) => {
    const {roadmapId} = req.params;
    const reqRoadmap = await Publicroadmap.findById(roadmapId).populate({
        path: 'section'
    })
    res.render('roadmap/publicShow', {reqRoadmap});
}))

router.put('/public/:roadmapId/edit', isLoggedIn, roadmapAuthor, catchAsync(async (req, res) => {
    const {roadmapId} = req.params;
    const {title, description} = req.body;
    const updatedRoadmap = await Publicroadmap.findByIdAndUpdate(roadmapId, {title: title, description: description});
    res.redirect('/public');
}))

router.put('/private/:roadmapId/edit', isLoggedIn, catchAsync(async (req, res) => {
    const {roadmapId} = req.params;
    const {title, description} = req.body;
    const updatedRoadmap = await Roadmap.findByIdAndUpdate(roadmapId, {title: title, description: description});
    res.redirect('/private');
}))

router.delete('/public/:roadmapId/delete', isLoggedIn, roadmapAuthor, catchAsync(async (req, res) => {
    const {roadmapId} = req.params;
    const reqRoadmap = await Publicroadmap.findByIdAndRemove(roadmapId, catchAsync(async (err) => {
        if(err) console.log(err);
        const reqUser = await User.updateOne({_id:req.user._id},{$pullAll:{"publicroadmaps":[roadmapId]}})
        // console.log("inside delete", reqSubsection);
    }));
    res.redirect(`/public`);
}))

router.delete('/private/:roadmapId/delete', isLoggedIn, catchAsync(async (req, res) => {
    const {roadmapId} = req.params;
    const reqRoadmap = await Roadmap.findByIdAndRemove(roadmapId, catchAsync(async (err) => {
        if(err) console.log(err);
        const reqUser = await User.updateOne({_id:req.user._id},{$pullAll:{"roadmaps":[roadmapId]}})
        // console.log("inside delete", reqSubsection);
    }));
    res.redirect(`/private`);
}))









module.exports = router;