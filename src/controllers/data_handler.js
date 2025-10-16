"use strict;"
const fs = require('fs');
// const path = require('path');

let services = [];

function getServices(){
    return services;
}

function readServices(){
    services = JSON.parse(fs.readFileSync('./src/data/services.json'));
    services = services.map(service => service);
}

exports.getServices = getServices;
exports.readServices = readServices;