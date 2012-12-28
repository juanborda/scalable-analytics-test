var express = require('express');
var mongoose = require('mongoose');

var db_uri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/mydb'; 

mongoose.connect(db_uri);
var app = express();
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Connection to DB: SUCCESSFUL');
});

var eventSchema = mongoose.Schema({
	 event : {
         creative : String,
         event : String,
         consumer : String,
         user : {
            ip : String,
            browser : String,
            browser_version : String,
            location : String
         }
 	},
});

var Event = mongoose.model('Event', eventSchema);

app.get('/', function(req, res) {
	var a = req.query;

	var e = new Event({ event : req.query });
	
	mongo.Db.connect(mongoUri, function (err, db) {		
		db.collection('test', function (er, collection) {
			collection.insert({'event': a});
		});
	});
	res.send({ object: a, status: "success" });
});
 
app.get('/get-all', function (req, res) {
	mongo.Db.connect(mongoUri, function (err, db) {
		db.collection('test', function (er, collection) {
			var start = Date.now();
			console.log("time start: ", start);
			collection.find(function (err, cursor) {
				cursor.toArray(function (err, docs) {
					var end = Date.now();
					console.log("time end: ", end);
					console.log("------>");
					var time = end - start;
					res.send({ "queryTook" : time + "ms", "length" : docs.length});
				}); 
			});
		});
	});
});

app.get('/event/:id', function (req, res) {
	mongo.Db.connect(mongoUri, function (err, db) {
		db.collection('test', function (er, collection) {
			var id = req.params.id;
			var ev = collection.find({ "event.creative" : id });
			var item = ev.toArray(function (err, docs) {
				res.send({"events": docs});
			});	
		});
	});
});

var port = process.env.PORT || 3000;
console.log("Listening on " + port);
 
app.listen(port);