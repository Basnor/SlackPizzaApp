const mongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27018/';

// Database Name
const dbName = 'ordersdb';

module.exports.insertOrder = function(doc, callback) {
    
    mongoClient.connect(url, function(err, client) {
        if(err) {
            return console.log(err);
        }
    
        const db = client.db(dbName);
        const collection = db.collection("orders");

        collection.insertOne(doc, function(err, doc){
            if(err) {
                return console.log(err);
            }
            callback(doc);
            client.close();
        });

    });
};
