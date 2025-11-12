const express = require('express');
const path = require('path');

const router = express.Router();

const servicesRouter = require('../routes/servicesRouter.js');
const providersRouter = require('../routes/providersRouter.js');
const usersRouter = require('../routes/usersRouter.js');
const bookingsRouter = require('../routes/bookingsRouter.js');

router.use('/bookings', bookingsRouter);
router.use('/services', servicesRouter);
router.use('/providers', providersRouter);
router.use('/users', usersRouter);

router.get('/', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/home.html")));
router.get('/home', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/home.html")));
router.get('/login', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/login.html")));
router.get('/register', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/register.html")));
router.get('/individualServiceDetail', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/individualServiceDetail.html")));
router.get('/serviceDetail', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/serviceDetail.html")));
router.get('/becomeProvider', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/becomeProvider.html")));
router.get('/booking', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/booking.html")));
router.get('/providerProfile', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/providerProfile.html")));
router.get('/search', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/search.html")));
router.get('/userProfile', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/userProfile.html")));
router.get('/payment', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/payment.html")));
router.get('/providerProfileView', (req, res) => res.sendFile(path.resolve(__dirname + "/../web/views/providerProfileView.html")));


//Future pages

module.exports = router;