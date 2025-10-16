const express = require('express');
const dataHandler = require('../controllers/data_handler.js');
const fs = require('fs');

dataHandler.readServices();
let services = dataHandler.getServices();

const router = express.Router();


router.get('/', (req, res) => {
    res.send(services);
});

router.get('/:id', (req, res) => {
    const service = services.find(s => s.id === parseInt(req.params.id));
    if (service) {
        res.send(service);
    } else {
        res.status(404).send('Service not found');
    }
});

module.exports = router;