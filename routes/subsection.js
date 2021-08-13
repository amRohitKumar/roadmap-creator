const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Roadmap = require('../models/roadmap');
const Section = require('../models/section');


router.post('/:roadmapId/subsection/:sectionId', async (req, res) => {
    const {roadmapId,sectionId} = req.params;
    const reqSection = await Section.findById(sectionId);
    res.render('roadmap/subsection', {reqSection});
})
















module.exports = router;