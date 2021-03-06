const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../../credentials');

module.exports = new PassportLocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		session: false,
		passReqToCallback: true
}, (req, username, password, done) => {

		const userData = {
			username: username.trim(),
			password: password.trim()
		};

		//find a user by username
		return User.findOne({ username: userData.username }, (err, user) => {
			if (err) {
				return done(err);
			}
			if (!user) {
				const error = new Error('Incorrect username or password');
				error.name = 'IncorrectCredentialsError';
				return done(error);
			}
			//check if the hash of the submitted password matches the one in the database
			return user.comparePassword(userData.password, (passwordErr, isMatch) => {
				if (err) {
					return done(err);
				}
				if (!isMatch) {
					const error = new Error('Incorrect username or password');
					error.name = 'IncorrectCredentialsError';
					return done(error);
				}

				const payload = {
					sub: user._id,
					name: user.username
				};

				//create a token string
				const token = jwt.sign(payload, config.jwtSecret);
			return done(null, token);
		});
	});
});