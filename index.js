var express = require('express');
var request = require('request');
const bodyParser = require ('body-parser');

var clientId = process.env.SLACK_CLIENT_ID;
var clientSecret = process.env.SLACK_CLIENT_SECRET;

// Instantiates Express and assigns our app variable to it
var app = express();

app.use (bodyParser.json ());
app.use (bodyParser.urlencoded ({extended: true}));


const PORT=3000;

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

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27018/';

let order;
var address = null;
var name = null;
var size = null;

app.post('/clear', function(req, res) {
    address = null;
    name = null;
    size = null;
    res.send('You can input again');
});

app.post('/name', function(req, res) {
    var name1 = req.body.text;
    res.send('You chosen ' + name1 + ' pizza');
    name = name1;

    console.log("HERE 1 ");

    if (checkOrder()) {
        res.send('Your order has been accepted.');
    }

});

app.post('/size', function(req, res) {
    var size1 = req.body.text;
    res.send('The size of your pizza: ' + size1 + ' cm');
    size = size1;

    if (checkOrder()) {
        res.send('Your order has been accepted.');
    }

});

app.post('/address', function(req, res) {
    var address1 = req.body.text;
    res.send('We will deliver pizza to ' + address1);
    address = address1;

    if (checkOrder()) {
        res.send('Your order has been accepted.');
    }

});

function checkOrder() {

    if ((name == null) ||
        (size == null) ||
        (address == null)) {

        return false;
    }


    //
    const mongoClient = new MongoClient(url, { useNewUrlParser: true });

    mongoClient.connect(function(err, client) {
        const db = client.db("ordersdb");
        const collection = db.collection("orders");

        let order = {
            Name: name,
            Size: size,
            Address: address
        };

        collection.insertOne(order, function(err, result){

            if(err){
                return console.log(err);
            }
            console.log(result.ops);
            client.close();
        });

        address = null;
        name = null;
        size = null;

    });


    return true;

}
