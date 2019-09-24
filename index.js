require('dotenv').config();
var express = require('express');
var request = require('request');
const bodyParser = require ('body-parser');

var clientId = process.env.SLACK_CLIENT_ID;
var clientSecret = process.env.SLACK_CLIENT_SECRET;

// Instantiates Express and assigns our app variable to it
var app = express();

app.use (bodyParser.json ());
app.use (bodyParser.urlencoded ({extended: true}));


const PORT=process.env.PORT_SERVER;

// Lets start our server
app.listen(PORT, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Example app listening on port " + PORT);
});


// This route handles GET requests to our root ngrok address and responds with the same "Ngrok is working message" we used before
app.get('/', function(req, res) {
    res.send('Ngrok is working! Path Hit: ' + req.url);
});

// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there...

        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
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



var queries = require('./services/db');

var order = {
    name: '',
    size: '',
    address: ''
};

app.post('/', function (req, res) {

    res.send('Enter order details');

});

app.post('/accept', function (req, res) {

    const doc = order;

    queries.insertOrder(doc, function (doc) {
        res.send('Your order has been accepted');
    });

});

app.post('/name', function(req, res) {
    order.name = req.body.text;
    return formOrder(res);
});

app.post('/size', function(req, res) {
    order.size= req.body.text;
    return formOrder(res);
});

app.post('/address', function(req, res) {
    order.address=req.body.text;
    return formOrder(res);
});

function formOrder(res) {
    return res.send( 'You enter new value' + '\n' +
        'Name: ' + order.name + '\n' +
        'Sise: ' + order.size + '\n' +
        'Address: ' + order.address );
}
