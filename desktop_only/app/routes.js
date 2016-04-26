module.exports = function(app, passport) {
	//homepage
	app.get('/', function(req, res) {
		res.render('index.ejs');//load default page
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
		res.render('profile.ejs', {
			user : req.user //get the user out of session and pass to template
		});
	});

	//logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	//function for checking user is logged in
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}

		//if not authenticated, redirect to home page
		res.redirect('/');
	}
}