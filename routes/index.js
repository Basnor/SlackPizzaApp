require('dotenv').config();
var express = require('express');
var request = require('request');
var router = express.Router();

var clientId = process.env.SLACK_CLIENT_ID;
var clientSecret = process.env.SLACK_CLIENT_SECRET;

// GET /
router.get('/', function(req, res) {
    res.sendFile( '/home.html', { root: __dirname+ '/../views'});
});

// GET /oauth
router.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint.
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there...

        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret},
            method: 'GET', //Specify the method

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);

            }
        })
    }
});

module.exports = router;
