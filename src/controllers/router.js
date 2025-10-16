const express = require('express');
const path = require('path');

const router = express.Router();

const servicesRouter = require('../routes/servicesRouter.js');
const providersRouter = require('../routes/providersRouter.js');

router.use('/services', servicesRouter);
router.use('/providers', providersRouter);

router.get('/', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/home.html")));
router.get('/home', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/home.html")));
router.get('/serviceDetail', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/serviceDetail.html")));
router.get('/becomeProvider', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/becomeProvider.html")));
router.get('/booking', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/booking.html")));
router.get('/editUserProfile', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/editUserProfile.html")));
router.get('/providerProfile', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/providerProfile.html")));
router.get('/search', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/search.html")));
router.get('/userProfile', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/userProfile.html")));

//Future pages
// router.get('/login', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/login.html")));
// router.get('/register', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/register.html")));
// router.get('/payment', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/payment.html")));

module.exports = router;