const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Roadmap = require('../models/roadmap');
const Section = require('../models/section');
const Subsection = require('../models/subsection');

router.get('/private/:roadmapId/subsection/:sectionId', async (req, res) => {
    const {roadmapId,sectionId} = req.params;
    const reqSection = await Section.findById(sectionId).populate('subsections');
    // console.log(reqSection);
    res.render('roadmap/subsection', {reqSection, roadmapId});
})

router.get('/public/:roadmapId/subsection/:sectionId', async (req, res) => {
    const {roadmapId,sectionId} = req.params;
    const reqSection = await Section.findById(sectionId).populate('subsections');
    res.render('roadmap/publicSubsection', {reqSection, roadmapId});
})

router.post('/:roadmapId/subsection/:sectionId/add', async (req, res) => {
    const {roadmapId , sectionId} = req.params;
    const reqSection = await Section.findById(sectionId);
    const {subsection, linktext} = req.body;
    const userId = req.user._id;
    const newSubsection = new Subsection({heading: subsection, status: false, linkText: linktext, completedCount: 0, totalUserCount: 0, userId: userId});
    await newSubsection.save();
    reqSection.subsections.push(newSubsection);
    await reqSection.save();
    req.flash('success', 'Created new subsection !');
    res.redirect(`/${roadmapId}/subsection/${sectionId}`);
})








module.exports = router;