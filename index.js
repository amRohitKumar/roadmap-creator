const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');


const userRoutes = require('./routes/user');











const PORT = 8080;
const dbUrl = 'mongodb://localhost:27017/Roadmap-Creator';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
    .then(() => {
        console.log('MONGOOSE CONNECTION OPEN');
    })
    .catch((err) => {
        console.log('IN MONGOOSE SOMETHING WENT WRONG', err);
    })


app.use('/', userRoutes);














app.get('/', (req, res) => {
    res.send("THIS IS OUR TEMPORARY HOME PAGE !!!");
})

app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`);
})