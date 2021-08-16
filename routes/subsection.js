const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Roadmap = require('../models/roadmap');
const Section = require('../models/section');
const Publicsection = require('../models/publicsection');
const Subsection = require('../models/subsection');
const Publicsubsection = require('../models/publicsubsection');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, roadmapAuthor} = require('../utils/middleware');


router.get('/private/:roadmapId/subsection/:sectionId', isLoggedIn, catchAsync(async (req, res) => {
    const {roadmapId,sectionId} = req.params;
    const reqSection = await Section.findById(sectionId).populate('subsections');
    res.render('roadmap/subsection', {reqSection, roadmapId});
}))

router.get('/public/:roadmapId/subsection/:sectionId', isLoggedIn, catchAsync(async (req, res) => {
    const {roadmapId,sectionId} = req.params;
    const reqSection = await Publicsection.findById(sectionId).populate('subsections');
    console.log(reqSection);
    res.render('roadmap/publicSubsection', {reqSection, roadmapId});
}))

router.post('/private/:roadmapId/subsection/:sectionId/add', isLoggedIn, catchAsync(async (req, res) => {
    const {roadmapId , sectionId} = req.params;
    const reqSection = await Section.findById(sectionId);
    const {subsection, linktext} = req.body;
    const userId = req.user._id;
    const newSubsection = new Subsection({heading: subsection, status: false, linkText: linktext, author: req.user});
    await newSubsection.save();
    reqSection.subsections.push(newSubsection);
    await reqSection.save();
    req.flash('success', 'Created new subsection !');
    res.redirect(`/private/${roadmapId}/subsection/${sectionId}`);
}))

router.post('/public/:roadmapId/subsection/:sectionId/add', isLoggedIn, roadmapAuthor, catchAsync(async (req, res) => {
    const {roadmapId , sectionId} = req.params;
    const reqSection = await Publicsection.findById(sectionId);
    const {subsection, linktext} = req.body;
    const userId = req.user._id;
    const newSubsection = new Publicsubsection({heading: subsection, linkText: linktext, completedCount: 0, totalUserCount: 0, author: req.user});
    await newSubsection.save();
    reqSection.subsections.push(newSubsection);
    await reqSection.save();
    req.flash('success', 'Created new subsection !');
    res.redirect(`/public/${roadmapId}/subsection/${sectionId}`);
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