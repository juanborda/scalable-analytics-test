var express = require('express');
var mongoose = require('mongoose');
var http = require('http');
path = require('path');

// start the diferent configurations
var db_uri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/mydb'; 

mongoose.connect(db_uri);
var app = express();
var db = mongoose.connection;

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
});

db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', function callback () {
	console.log('Connection to DB: SUCCESSFUL');
});

app.configure('development', function(){
  app.use(express.errorHandler());
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
 	}
});

var Event = mongoose.model('Event', eventSchema);

Event.schema.path('event.creative').validate(function (value) {
	return /[0-9]+/i.test(value);
}, 'Invalid creative');

app.get('/save', function(req, res) {
	var event = new Event({ event : req.query });	
	event.save(function (err, obj) {
        console.log(err ? 'Error when try to save a new creative' : 'Saved successfull ID:' + obj.creative);
	});
	res.send({object: event, status: "success" });
});
 
app.get('/get-all', function (req, res) {
	return Event.find(function (err, response) {
		return res.send(err ? 'It produces an error' : response);
	})
});

app.get('/count', function (req, res) {
	//{'event.consumer': /ngp/i }, 
	Event.count(function (err, response) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.write(JSON.stringify({'Total Events': response}));
		res.end();
	})
});

app.get('/event/:id', function (req, res) {
	var id = req.params.id;
	return Event.find({'event.creative': id }, function (err, response) {
		return res.send(err ? 'It produces an error' : response);
	});
});

app.get('/remove-all', function (req, res) {
	return Event.remove(function (err, response) {
		return res.send(err ? 'It produces an error' : response);
	})
});

app.get('/remove/:id', function (req, res) {
	var id = req.params.id;
	console.log(id);
	return Event.remove({'event.creative': id }, function (err, response) {
		return res.send(err ? 'It produces an error' : response);
	})
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});