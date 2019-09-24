require('dotenv').config();
var express = require('express');
const bodyParser = require ('body-parser');

var orders = require('./routes/orders');
var index = require('./routes/index');

var app = express();
app.use (bodyParser.json ());
app.use (bodyParser.urlencoded ({extended: true}));

app.use('/', index);
app.use('/order', orders);

const PORT = process.env.PORT_SERVER;

// Lets start our server
app.listen(PORT, function () {
    console.log("Example app listening on port " + PORT);
});
