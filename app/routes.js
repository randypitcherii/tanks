var User = require('../app/models/user');

module.exports = function(app, passport) {
	//homepage
	app.get('/', isLoggedIn, function(req, res) {
		//if logged in, send to profile page, otherwise isLoggedIn will handle it
		res.redirect('/profile');
	});

	//login
	app.get('/login', function(req, res) {
		//load login page with any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	//process login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
	}));

	//signup
	app.get('/signup', function(req, res) {
		//load signup page with any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	//process signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : 'signup',
		failureFlash : true
	}));

	//go to profile (make sure they're logged in)
	app.get('/profile', isLoggedIn, function(req, res) {
		req.user.activeGame = false;
		req.user.save(function(err) {
			res.render('profile.ejs', {
				user : req.user //get the user out of session and pass to template
			});
		});	
	});

	//create game (make sure they're logged in)
	app.get('/createGame', isLoggedIn, function(req, res) {
		req.user.activeGame = true;
		req.user.hasOpponent = false;
		req.user.save(function(err) {
			res.render('createGame.ejs', {
				user : req.user, //get the user out of session and pass to template
			});
		});
	});

	//join a game (make sure they're logged in)
	app.post('/joinGame', isLoggedIn, function(req, res) {
		res.render('joinGame.ejs', {
			user : req.user, //get the user out of session and pass to template
			gameID : req.body.gameID //get gameID from post data
		});
	});

	//see available games (make sure they're logged in)
	app.get('/ongoingGames', isLoggedIn, function(req, res) {
		res.render('ongoingGames.ejs', {
			user : req.user, //get the user out of session and pass to template
		});
	});

	//see available games (make sure they're logged in)
	app.get('/getGames', isLoggedIn, function(req, res) {
		User.find({'activeGame' : true, 'hasOpponent' : false}, 'username', 
			function(err, docs) {
				res.send(docs);
		});
	});

	//end game
	app.get('/endGame', isLoggedIn, function(req, res) {
		req.user.activeGame = false;
		req.user.save(function(err) {
			res.redirect('/profile');
		});
	});

	//logout
	app.get('/logout', function(req, res) {
		req.user.activeGame = false;
		req.user.save(function(err) {
			req.logout();
			res.redirect('/');
		});		
	});

	//function for checking user is logged in
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}

		//if not authenticated, redirect to default page
		res.render('index.ejs');//load default page
	}
};