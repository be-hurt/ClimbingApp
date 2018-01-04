const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = new PassportLocalStrategy({
		userNameField: 'username',
		passwordField: 'password',
		session: false,
		passReqToCallback: true
	}, 
	(req, username, password, done) => {
		const userData = {
			username: req.body.username.trim(),
			email: req.body.email.trim(),
			password: req.body.password.trim()
		};

		//create a method to handle saving the user to the database
		//THIS IS NOT FIRING
		const user = new User(userData);
		user.save((err) => {
			if (err) {
				return done(err);
			}
			return done(null);
		});
});