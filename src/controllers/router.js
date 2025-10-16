const express = require('express');
const path = require('path');

const router = express.Router();

const servicesRouter = require('../routes/servicesRouter.js');

router.use('/services', servicesRouter);

router.get('/', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/home.html")));
router.get('/home', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/home.html")));
router.get('/serviceDetail', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/serviceDetail.html")));

module.exports = router;