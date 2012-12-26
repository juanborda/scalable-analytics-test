var express = require('express');
var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/mydb'; 
 
var app = express();
app.get('/', function(req, res) {
	var a = req.query;
	
	mongo.Db.connect(mongoUri, function (err, db) {		
		db.collection('test', function (er, collection) {
			collection.insert({'event': a});
		});
		console.log("EVENT: ", a);
	});
	res.send({ object: a, status: "success" });
});
 
app.get('/get-all', function (req, res) {
	mongo.Db.connect(mongoUri, function (err, db) {
		db.collection('test', function (er, collection) {
			collection.find(function (err, cursor) {
				cursor.toArray(function (err, docs) {
					var queryResults = [];
				    for(var i=0; i<docs.length; i++) {
						queryResults[i] = docs[i]; 
				    }
				    db.close();
				    res.send({"objects": queryResults});
				});
			});
		});
	});
});

var port = process.env.PORT || 3000;
console.log("Listening on " + port);
 
app.listen(port);