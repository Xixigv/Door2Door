const express = require('express');

const router = express.Router();

router.get('/socket', (req, res) => {
    
    const wsUrl = process.env.WS_API_URL;

    res.json({ wsUrl });
});

router.get('/messages', (req, res) => {
    
    const apiUrl = process.env.LAMBDA_API_URL;

    res.json({ apiUrl });
});

module.exports = router;