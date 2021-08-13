const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Roadmap = require('../models/roadmap');
const Section = require('../models/section');


router.post('/:roadmapId/newsection', async (req, res) => {
    const {roadmapId} = req.params;
    const {duration, heading} = req.body;
    const reqRoadmap = await Roadmap.findById(roadmapId);
    const newSection = new Section({heading, duration});
    await newSection.save()
    reqRoadmap.section.push(newSection._id);
    await reqRoadmap.save();
    req.flash('success', "New section added to Roadmap !");
    res.redirect(`/${req.user._id}/rp/${roadmapId}`);
})
















module.exports = router;