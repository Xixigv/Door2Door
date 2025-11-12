const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const router = require ('./src/controllers/router.js');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/', router);
app.use(express.static('src'));
app.use('src/web/', express.static('web'));

app.listen(port, () => {
    console.log("Aplicacion de ejemplo corriendo en puerto " + port);
});