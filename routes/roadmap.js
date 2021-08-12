const express = require('express');
const router = express.Router();

router.get('/:userId', (req, res) => {
    res.redirect('roadmap/homepage');
})
















module.exports = router;