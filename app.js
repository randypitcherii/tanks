//require core external libraries
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

//require helper libraries
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//database config file
var configDB = require('./config/database.js');

//setup port and host. This allows the same code to be run on bluemix
//and locally.
var port = (process.env.VCAP_APP_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || 'localhost');

//setup database
mongoose.connect(configDB.url);//connect to our DB

//configure passport
require('./config/passport')(passport);

//setup express
app.use(morgan('dev')); //log every request to the console
app.use(cookieParser()); //read cookies
app.use(bodyParser()); //read html forms
app.use(express.static('public'));
app.set('view engine', 'ejs'); //setup ejs for templating

//setup passport
app.use(session({ secret: 'RavenclawAllDay'}));//session secret
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash()); //use for flash messages

//setup routes
require('./app/routes.js')(app, passport);

//establish socket listener
io.on('connection', function(socket) {
	socket.on('join', function(room) {
		socket.join(room);
	});

    socket.on('move', function(moveObject) {
        io.to(moveObject.gameID).emit('move', moveObject);
        console.log(moveObject.name + " sent: " + moveObject.move);
    });
});

//start the server.
http.listen(port, function() {
	console.log("Listening on port " + port);
})