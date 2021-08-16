const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Roadmap = require('../models/roadmap');
const Publicroadmap = require('../models/publicRoadmap');
const Section = require('../models/section');
const Publicsection = require('../models/publicsection');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, roadmapAuthor} = require('../utils/middleware');

router.post('/private/:roadmapId/newsection', isLoggedIn, catchAsync(async (req, res) => {
    const {roadmapId} = req.params;
    const {duration, heading} = req.body;
    const reqRoadmap = await Roadmap.findById(roadmapId);
    const newSection = new Section({heading, duration, author: req.user});
    await newSection.save()
    reqRoadmap.section.push(newSection);
    await reqRoadmap.save();
    req.flash('success', "New private section added to Roadmap !");
    res.redirect(`/private/${roadmapId}/subsection/${newSection._id}`);
}))

router.post('/public/:roadmapId/newsection', isLoggedIn, roadmapAuthor, catchAsync(async (req, res) => {
    const {roadmapId} = req.params;
    const {duration, heading} = req.body;
    const reqRoadmap = await Publicroadmap.findById(roadmapId);
    console.log(reqRoadmap);
    const newSection = new Publicsection({heading, duration, author: req.user});
    await newSection.save()
    reqRoadmap.section.push(newSection);
    await reqRoadmap.save();
    req.flash('success', "New public section added to Roadmap !");
    res.redirect(`/publicrp/${roadmapId}`);
}))

router.put('/private/:roadmapId/:sectionId/edit', isLoggedIn, catchAsync( async (req, res) => {
    const {roadmapId, sectionId} = req.params;
    const {heading, duration} = req.body;
    const updatedSection = await Section.findByIdAndUpdate(sectionId, {heading: heading, duration: duration});
    res.redirect(`/privaterp/${roadmapId}`);
}))

router.put('/public/:roadmapId/:sectionId/edit', isLoggedIn, roadmapAuthor,catchAsync( async (req, res) => {
    const {roadmapId, sectionId} = req.params;
    const {heading, duration} = req.body;
    const updatedSection = await Publicsection.findByIdAndUpdate(sectionId, {heading: heading, duration: duration});
    res.redirect(`/publicrp/${roadmapId}`);
}))

router.delete('/private/:roadmapId/:sectionId/delete', isLoggedIn ,catchAsync( async (req, res) => {
    const {roadmapId, sectionId} = req.params;
    const reqSection = await Section.findByIdAndRemove(sectionId, catchAsync(async (err) => {
        if(err) console.log(err);
        const reqRoadmap = await Roadmap.updateOne({_id:roadmapId},{$pullAll:{"section":[sectionId]}})
        // console.log("inside delete", reqSubsection);
    }));
    res.redirect(`/private/${roadmapId}`);
}))

router.delete('/public/:roadmapId/:sectionId/delete', isLoggedIn, roadmapAuthor ,catchAsync( async (req, res) => {
    const {roadmapId, sectionId} = req.params;
    const reqSection = await Publicsection.findByIdAndRemove(sectionId, catchAsync(async (err) => {
        if(err) console.log(err);
        const reqRoadmap = await Publicroadmap.updateOne({_id:roadmapId},{$pullAll:{"section":[sectionId]}})
        // console.log("inside delete", reqSubsection);
    }));
    res.redirect(`/public/${roadmapId}`);
}))

module.exports = router;