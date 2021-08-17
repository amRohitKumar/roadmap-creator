const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Roadmap = require('../models/roadmap');
const Section = require('../models/section');
const Publicsection = require('../models/publicsection');
const Subsection = require('../models/subsection');
const Publicsubsection = require('../models/publicsubsection');
const catchAsync = require('../utils/catchAsync');
const {alreadyDone} = require('../utils/helperFunction');
const {isLoggedIn, roadmapAuthor} = require('../utils/middleware');


router.get('/private/:roadmapId/subsection/:sectionId', isLoggedIn, catchAsync(async (req, res) => {
    const {roadmapId,sectionId} = req.params;
    const reqSection = await Section.findById(sectionId).populate('subsections');
    res.render('roadmap/subsection', {reqSection, roadmapId});
}))

router.get('/public/:roadmapId/subsection/:sectionId', isLoggedIn, catchAsync(async (req, res) => {
    const {roadmapId,sectionId} = req.params;
    const reqSection = await Publicsection.findById(sectionId).populate({
        path: 'subsections',
        populate:[{
            path: 'completed',
            model:'User',
            select:'name'
        }]
    });
    // console.log(reqSection);
    const finalArray = reqSection.subsections.map(function(obj){
        return obj.completed.map(function(obj1){
            return obj1._id;
        })
    })
    // console.log(finalArray);
    res.render('roadmap/publicSubsection', {reqSection, roadmapId, finalArray});
}))

router.get('/publicss/:roadmapId/:sectionId/:subsectionId/statusChange', isLoggedIn, catchAsync( async (req, res) => {
    const {subsectionId, roadmapId, sectionId} = req.params;
    const reqSubsection = await Publicsubsection.findById(subsectionId)
    const currUser = await User.findById(req.user._id);
    // console.log(reqSubsection.completed);
    const currStatus = alreadyDone(reqSubsection,req.user._id);
    // console.log(currStatus);
    if(currStatus){
        console.log('deleting ....');
        // const res = await Publicsubsection.findByIdAndUpdate(subsectionId, {$pull: {"completed": [req.user._id]}});
        const index = reqSubsection.completed.indexOf(req.user._id);
        reqSubsection.completed.splice(index,1);
        await reqSubsection.save();
        // console.log(reqSubsection.completed);
    }
    else{
        reqSubsection.completed.push(currUser);
        await reqSubsection.save();
    }
    // console.log(reqSubsection.completed);
    res.redirect(`/public/${roadmapId}/subsection/${sectionId}`);
}))

router.post('/private/:roadmapId/subsection/:sectionId/add', isLoggedIn, catchAsync(async (req, res) => {
    const {roadmapId , sectionId} = req.params;
    const reqSection = await Section.findById(sectionId);
    const {heading, link = 'NOLINK'} = req.body;
    const newSubsection = new Subsection({heading: heading, status: false, author: req.user, link: link});
    await newSubsection.save();
    reqSection.subsections.push(newSubsection);
    await reqSection.save();
    req.flash('success', 'Created new subsection !');
    res.redirect(`/private/${roadmapId}/subsection/${sectionId}`);
}))

router.post('/public/:roadmapId/subsection/:sectionId/add', isLoggedIn, roadmapAuthor, catchAsync(async (req, res) => {
    const {roadmapId , sectionId} = req.params;
    const reqSection = await Publicsection.findById(sectionId);
    const {heading, link = 'NOLINK'} = req.body;
    const newSubsection = new Publicsubsection({heading: heading, author: req.user, link: link});
    await newSubsection.save();
    reqSection.subsections.push(newSubsection);
    await reqSection.save();
    req.flash('success', 'Created new subsection !');
    res.redirect(`/public/${roadmapId}/subsection/${sectionId}`);
}))

router.put('/public/:roadmapId/:sectionId/:subsectionId/edit', isLoggedIn, roadmapAuthor, catchAsync( async (req, res) => {
    const {roadmapId, sectionId, subsectionId} = req.params;
    const {heading, link} = req.body;
    const updatedSubsection = await Publicsubsection.findByIdAndUpdate(subsectionId, {heading: heading, link: link});
    res.redirect(`/public/${roadmapId}/subsection/${sectionId}`);
}))

router.put('/private/:roadmapId/:sectionId/:subsectionId/edit', isLoggedIn, catchAsync( async (req, res) => {
    const {roadmapId, sectionId, subsectionId} = req.params;
    const {heading, link} = req.body;
    const updatedSubsection = await Subsection.findByIdAndUpdate(subsectionId, {heading: heading, link: link});
    res.redirect(`/private/${roadmapId}/subsection/${sectionId}`);
}))

router.delete('/private/:roadmapId/:sectionId/:subsectionId/delete', isLoggedIn ,catchAsync(async (req, res) => {
    const {subsectionId, roadmapId, sectionId} = req.params;
    const reqSubsection = await Subsection.findByIdAndRemove(subsectionId, catchAsync(async (err) => {
        if(err) console.log(err);
        const reqSubsection = await Section.updateOne({_id:sectionId},{$pullAll:{"subsections":[subsectionId]}})
        // console.log("inside delete", reqSubsection);
    }));
    res.redirect(`/privaterp/${roadmapId}`);
}))

router.delete('/public/:roadmapId/:sectionId/:subsectionId/delete', isLoggedIn ,roadmapAuthor ,catchAsync(async (req, res) => {
    const {subsectionId, roadmapId, sectionId} = req.params;
    const reqSubsection = await Publicsubsection.findByIdAndRemove(subsectionId, catchAsync(async (err) => {
        if(err) console.log(err);
        const reqSubsection = await Publicsection.updateOne({_id:sectionId},{$pullAll:{"subsections":[subsectionId]}})
        // console.log("inside delete", reqSubsection);
    }));
    res.redirect(`/publicrp/${roadmapId}`);
}))

module.exports = router;