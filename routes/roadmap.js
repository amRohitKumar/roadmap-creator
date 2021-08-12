const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Roadmap = require('../models/roadmap');
const {DateAndMonth} = require('../utils/helperFunction');

router.get('/:userId', (req, res) => {
    res.render('roadmap/homepage');
})

router.post('/create/:userId', async (req, res) => {
    const {title, description} = req.body;
    const {userId} = req.params;
    const author = req.user.name;
    const currentDate = DateAndMonth();
    const reqUser = await User.findById(req.user._id);
    const newRoadmap = new Roadmap({title, description, author: userId});
    await newRoadmap.save();
    req.flash('success', "Added new Roadmap !");
    res.redirect(`/${userId}`);
})














module.exports = router;