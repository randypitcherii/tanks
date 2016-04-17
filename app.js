//require external libraries
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//setup port and host. This allows the same code to be run on bluemix
//and locally.
var port = (process.env.VCAP_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');

//handle the default request
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/html/index.html');
});

//establish access to public folder
app.use(express.static('public'));

//establish socket listener
io.on('connection', function(socket) {
	socket.on('chat message', function(msg){
	    io.emit('chat message', msg);
	});
});

//start the server.
http.listen(port, function() {
	console.log('listening on ' + host + ':' + port);
});