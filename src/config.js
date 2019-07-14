'use strict';

const path = require('path');
const fs = require('fs');
var config = require('./config.json');

const readCert = filename => fs.readFileSync(path.resolve(__dirname, config.certificatesPath, filename));

if (config.certificatesPath) {
    config.certificates = {
        client: {
            key: readCert('client_key.pem'),
            cert: readCert('client.pem')
        }
    }    
}

module.exports = config;