const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Roadmap = require('../models/roadmap');
const Publicroadmap = require('../models/publicRoadmap');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, roadmapAuthor, privateRoadmapAuthor} = require('../utils/middleware');
const ExpressError = require('../utils/ExpressError');


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

router.get('/public/:roadmapId/leave', isLoggedIn, catchAsync( async (req, res) => {
    const {roadmapId} = req.params;
    const userId = req.user._id;
    const reqUser = await User.findById(userId);
    const index2 = reqUser.publicroadmaps.indexOf(roadmapId);
    const reqRoadmap = await Publicroadmap.findById(roadmapId);
    const index = reqRoadmap.participants.indexOf(userId);
    // console.log(index); console.log(index2);
    if(index === -1 || index2 == -1){
        return new ExpressError("Something went wrong ! Please try again", 500);
    }
    else{
        reqRoadmap.participants.splice(index, 1);
        await reqRoadmap.save();
        reqUser.publicroadmaps.splice(index2, 1);
        await reqUser.save();
        req.flash('success', "Successfully removed the public roadmap !");
    }
    res.redirect('/public');
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

router.post('/private', isLoggedIn,catchAsync(async (req, res) => {
    const {title, description} = req.body;
    const userId = req.user._id;
    const author = req.user.name;
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
    let finalRoadmapId = uniqueId.toString().trim();
    const reqPublicRoadmap = await Publicroadmap.findById(finalRoadmapId);
    
    if(!reqPublicRoadmap){
        req.flash('error', "Word UniqueId or password ! Please try again .");
        res.redirect('/public');
    }
    const authorId = (reqPublicRoadmap.author._id).toString();
    if(authorId == req.user._id){
        req.flash('error', "You can't join your own roadmap !");
        return res.redirect('/public');
    }
    if(reqPublicRoadmap.password === password){
        const reqUser = await User.findById(userId);
        let result = true;
        for(let r of reqUser.publicroadmaps){
            if(r._id.toString() === finalRoadmapId){
                result = false;
                break;
            }
        }
        if(!result){
            req.flash('error', "You can't join one roadmap twice !");
            res.redirect('/public');
        }
        else{
            reqUser.publicroadmaps.push(reqPublicRoadmap);
            await reqUser.save();
            reqPublicRoadmap.participants.push(reqUser);
            await reqPublicRoadmap.save();
            req.flash('success', "Roadmap added !");
            res.redirect('/public');
        }
    }
    else{
        req.flash('error', "Wrong UniqueId or password ! Please try again .");
        res.redirect('/public');
    }
}))

router.get('/private/:roadmapId/info',isLoggedIn, privateRoadmapAuthor ,catchAsync( async (req, res) => {
    const {roadmapId} = req.params;
    const reqRoadmap = await Roadmap.findById(roadmapId).populate({
        path: 'author',
        select: 'name'
    });
    res.render('roadmap/privateRoadmapInfo', {reqRoadmap});
}))

router.get('/public/:roadmapId/info', isLoggedIn, roadmapAuthor,catchAsync( async (req, res) => {
    const {roadmapId} = req.params;
    const reqRoadmap = await Publicroadmap.findById(roadmapId).populate({
        path: 'author',
        select: 'name'
    }).populate({
        path: 'participants',
        select: 'name',
    });
    // console.log(reqRoadmap);
    res.render('roadmap/publicRoadmapInfo', {reqRoadmap});
}))

router.get('/privaterp/:roadmapId',isLoggedIn, privateRoadmapAuthor ,catchAsync(async (req, res) => {
    const {roadmapId} = req.params;
    const reqRoadmap = await Roadmap.findById(roadmapId).populate({
        path: 'section'
    })
    if(!reqRoadmap){
        req.flash('error', "No private roadmaps found !");
        return res.redirect('/private');
    }
    res.render('roadmap/show', {reqRoadmap});
}))

router.get('/publicrp/:roadmapId', isLoggedIn, catchAsync(async (req, res) => {
    const {roadmapId} = req.params;
    const reqRoadmap = await Publicroadmap.findById(roadmapId).populate({
        path: 'section'
    })
    if(!reqRoadmap){
        req.flash('error', "No public roadmaps found !");
        return res.redirect('/private');
    }
    res.render('roadmap/publicShow', {reqRoadmap});
}))

router.put('/public/:roadmapId/edit',isLoggedIn, roadmapAuthor, catchAsync(async (req, res) => {
    const {roadmapId} = req.params;
    const {title, description} = req.body;
    const updatedRoadmap = await Publicroadmap.findByIdAndUpdate(roadmapId, {title: title, description: description});
    if(!updatedRoadmap){
        req.flash('error', "No public roadmap found !");
        return res.redirect('/public');
    }
    res.redirect('/public');
}))

router.put('/private/:roadmapId/edit', isLoggedIn, privateRoadmapAuthor ,catchAsync(async (req, res) => {
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

router.delete('/private/:roadmapId/delete', isLoggedIn, privateRoadmapAuthor ,catchAsync(async (req, res) => {
    const {roadmapId} = req.params;
    const reqRoadmap = await Roadmap.findByIdAndRemove(roadmapId, catchAsync(async (err) => {
        if(err) console.log(err);
        const reqUser = await User.updateOne({_id:req.user._id},{$pullAll:{"roadmaps":[roadmapId]}})
        // console.log("inside delete", reqSubsection);
    }));
    res.redirect(`/private`);
}))









module.exports = router;