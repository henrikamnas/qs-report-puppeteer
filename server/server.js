 const express = require('express');
 const path = require('path');
 const fs = require('fs');
 const request = require('request');
 const puppeteer = require('puppeteer');
 const config = require('../src/config');

/**
 * Our Qlik Sense Server information
 * Needs exported certificates from Qlik Sense QMC
*/
var r = request.defaults({
    rejectUnauthorized: false,
    host: 'localhost',
    cert: config.certificates.client.cert,
    key: config.certificates.client.key
})

/**
 * Request ticket from QPS.
 * Adjust uri as needed.
 */
function getQlikSenseTicket(directory, user, callback) {    
    r.post({
        uri: `${config.engineHost}:4243/qps/ticket?xrfkey=abcdefghijklmnop`,
        body: JSON.stringify({
            "UserDirectory": directory,
            "UserId": user,
            "Attributes": []
        }),
        headers: {
            'x-qlik-xrfkey': 'abcdefghijklmnop',
            'content-type': 'application/json'
        }
    }, function(err, res, body) {
        if(err) return callback(err);
        var ticket = JSON.parse(body)['Ticket'];
        
        callback(null, ticket);       
    });
};

/**
 * Express settings
 */
var app = express();

/*Default route*/
app.get('/', function(req, res) {
    res.send('Connection successfull!');
});

/**
 * Static resources, i.e our page assets
 */
 app.use('/static', express.static(path.join(__dirname, '../public')));

/**
 * Capture route
**/
app.get('/capture/awaitdiv/:div/filename/:filename/width/:width/height/:height/url/*', function(req, res) {
    // Request a ticket, in this case for a hardcoded user
    getQlikSenseTicket(config.userDirectory, config.userId, function(err, ticket) {
        if(!err) {
            // If we got a ticket render template
            // authenticate user with said ticker using puppeteer as headless browser
                        
            (async () => {
                const browser = await puppeteer.launch({headless: config.headless, ignoreHTTPSErrors: true});
                const page = await browser.newPage();
                 await page.setViewport({ width: parseInt(req.params.width,10), height: parseInt(req.params.height,10)});
                await page.goto('https://' + req.url.split('/url/')[1].split('/')[2] +'/hub?qlikTicket=' + ticket,{waitUntil: 'load'}); //authenticate user with ticket
                await page.goto(req.url.split('/url/')[1],{waitUntil: 'load'}); //load the suppliead url from the get request
                await page.waitFor(req.params.div) //wait for an element to finish loading, supplied by parameter awaitdiv
                await page.screenshot({path: path.join(__dirname, '../public/images/',req.params.filename)}); //take screenshot and save to /public/images            
                                
                await browser.close(); 

                res.send(`Snapshot located at: <a href=http://localhost:${config.port}/static/images/${req.params.filename}>http://localhost:${config.port}/static/images/${req.params.filename}</a>`);

              })();

        } else {
            res.send('Error: ' + err) // handle error
        }
    })
});

// Start server
app.listen(config.port)

console.log(`Server listening at port: ${config.port}`);