var express = require('express');
 
var app = express();
 
app.get('/', function(req, res) {
	var a = req.query ;
  	res.send(a);
});
 
var port = process.env.PORT || 3000;
console.log("Listening on " + port);
 
app.listen(port);