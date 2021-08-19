const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('user/register');
})

router.get('/login', (req, res) => {
    res.render('user/login');
})

router.get("/login/google", passport.authenticate("google", {scope: ["profile", "email"]}));

router.get("/login/google/redirect", passport.authenticate('google', {failureRedirect: '/register'}), async (req, res) => {
    // console.log(req.user);
    let userId = req.user._id;
    const name = req.user.name;
    req.flash('success', `Welcome to Roadmap-Creator ${name}`)
    res.redirect(`/private`);
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(async (req, res) => {

    req.flash('success', `Welcome back ${req.user.name}!`);
    res.redirect(`/private`);
}))

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const newUser = new User({ name: name, emailId: email, username: username});
        const registerdUser = await User.register(newUser, password);
        req.login(registerdUser, err => {
            if(err) return next(err);
            req.flash('success', `Welcome to College-Quora ${req.user.name}!`);
            res.redirect(`/private`);
        })
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}))

router.get('/logout', catchAsync(async (req, res) => {
    const userName = req.user.name;
    await req.logout();
    req.flash('success', `Goodbye ${userName} !`);
    res.redirect('/');
}))

module.exports = router;