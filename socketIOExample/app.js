var app = require('express')();
var http = require('http').Server(app);
var port = (process.env.VCAP_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

http.listen(port, function() {
	console.log('listening on ' + host + ':' + port);

});