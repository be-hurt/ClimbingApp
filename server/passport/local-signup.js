const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = new PassportLocalStrategy({
	userNameField: 'name',
	passwordField: 'password',
	session: false,
	passReqToCallback: true
}, (req, name, email, password, done) => {
	const userData = {
		name: req.body.name.trim(),
		email: req.body.email.trim(),
		password: req.body.password.trim()
	};

	//create a method to handle saving the user to the database
	const user = new User(userData);
	user.save((err) => {
		if (err) {
			return done(err);
		}
		//if successfully added, return a message confirmation
		res.json({ message: 'User registration successful. Welcome to Rocks!'});
		return done(null);
	});
});