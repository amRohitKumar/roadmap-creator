const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('user/register');
})

router.get('/login', (req, res) => {
    res.render('user/login');
})

router.get("/login/google", passport.authenticate("google", {scope: ["profile", "email"]}));

router.get("/login/google/redirect", passport.authenticate('google', {failureRedirect: '/register'}), async (req, res) => {
    console.log(req.user);
    let userId = req.user._id;
    const name = req.user.name;
    req.flash('success', `Welcome to Roadmap-Creator ${name}`)
    res.redirect(`/${userId}`);
});

router.get('/logout', (req, res) => {
    const userName = req.user.name;
    req.logout();
    req.flash('success', `Goodbye ${userName} !`);
    res.redirect('/');
})

module.exports = router;