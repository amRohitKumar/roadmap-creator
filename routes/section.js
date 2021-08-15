const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Roadmap = require('../models/roadmap');
const Publicroadmap = require('../models/publicRoadmap');
const Section = require('../models/section');


router.post('/private/:roadmapId/newsection', async (req, res) => {
    const {roadmapId} = req.params;
    const {duration, heading} = req.body;
    const reqRoadmap = await Roadmap.findById(roadmapId);
    const newSection = new Section({heading, duration});
    await newSection.save()
    reqRoadmap.section.push(newSection);
    await reqRoadmap.save();
    req.flash('success', "New private section added to Roadmap !");
    res.redirect(`/${req.user._id}/rp/${roadmapId}`);
})

router.post('/public/:roadmapId/newsection', async (req, res) => {
    const {roadmapId} = req.params;
    const {duration, heading} = req.body;
    const reqRoadmap = await Publicroadmap.findById(roadmapId);
    const newSection = new Section({heading, duration});
    await newSection.save()
    reqRoadmap.section.push(newSection);
    await reqRoadmap.save();
    req.flash('success', "New public section added to Roadmap !");
    res.redirect(`/${req.user._id}/rp/${roadmapId}`);
})















module.exports = router;