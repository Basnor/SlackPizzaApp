var express = require('express');
var router = express.Router();

var queries = require('../services/db');

var order = {
    name: '',
    size: '',
    address: ''
};

router.post('/', function (req, res) {
    res.send('Enter order details');
});

router.post('/accept', function (req, res) {
    queries.insertOrder(order, function (doc) {
        res.send('Your order has been accepted');
        order = {
            name: '',
            size: '',
            address: ''
        };
    });
});

router.post('/name', function(req, res) {
    order.name = req.body.text;
    return formOrder(res);
});

router.post('/size', function(req, res) {
    order.size= req.body.text;
    return formOrder(res);
});

router.post('/address', function(req, res) {
    order.address=req.body.text;
    return formOrder(res);
});

function formOrder(res) {
    return res.send( 'You enter new value' + '\n' +
        'Name: ' + order.name + '\n' +
        'Size: ' + order.size + '\n' +
        'Address: ' + order.address );
}

module.exports = router;
