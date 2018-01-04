const express = require('express');
const validator = require('validator');
const passport = require('passport');

const router = new express.Router();

function validateSignupForm(payload) {
	const err = {};
	let isFormValid = true;
	let message = '';

	if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
		isFormValid = false;
		err.name = 'Please provide a username';
	}

	if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
		isFormValid = false;
		err.email = 'Please provide a valid email address';
	}

	if(!payload || typeof payload.password !== 'string' || payload.password.trim().length < 6) {
		isFormValid = false;
		err.password = 'Password must contain at least 6 characters';
	}

	if (!isFormValid) {
		message = 'Check the form for errors';
	}

	return {
		success: isFormValid,
		message,
		err
	};
}

function validateLoginForm(payload) {
	const errors = {};
	let isFormValid = true;
	let message = '';

	if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
		console.log(payload.username);
		isFormValid = false;
		errors.username = 'Please enter your username';
	}

	if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
		console.log(payload.password);
		isFormValid = false;
		errors.password = 'Please enter your password';
	}

	if(!isFormValid) {
		message = 'Check the form for errors';
	}

	return {
		success: isFormValid,
		message,
		errors
	};
}

function validateWallForm(payload) {
	const errors = {};
	let isFormValid = true;
	let message = '';

	//check for a name
	if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
		isFormValid = false;
		errors.name = "Please give the wall a name";
	}

	//no need to check for date, as that will be generated when the submission goes through
	//check for difficulty level
	if (!payload || typeof payload.difficulty !== 'number') {
		isFormValid = false;
		err.text = "Please enter a diffuculty level.";
	}

	return {
		success: isFormValid,
		message,
		err
	};
}
//note that adding walls to the site using the api should only be done by admins
//function validateWallForm(payload) {}

//create the routes
//create signup route
router.post('/signup', (req, res, next) => {
	const validationResult = validateSignupForm(req.body);
	if (!validationResult.success) {
		return res.status(400).json({
			success: false,
			message: validationResult.message,
			err: validationResult.err
		});
	}

	//use passport's local-signup method we created to validate
	return passport.authenticate('local-signup', (err) => {
		if (err) {
			if (err.name === 'MongoError' && err.code === 11000) {
				//this code represents a duplicate email error
				//the 409 status code is a conflict error
				return res.status(409).json({
					success: false,
					message: 'Check the form for errors',
					err: {
						email: 'This email is already taken. Please enter a unique email.'
					}
				});
			}

			return res.status(400).json({
				success: false,
				message: 'Could not process the form.'
			});
		}
		return res.status(200).json({
			success: true,
			message: 'User registration successful! Please visit the login page to login and access your account.'
		});
	})(req, res, next);
});

//create login route
router.post('/login', (req, res, next) => {
	const validationResult = validateLoginForm(req.body);
	if (!validationResult.success) {
		return res.status(400).json({
			success: false,
			message: validationResult.message,
			errors: validationResult.errors
		});
	}

	return passport.authenticate('local-login', (err, token, userData) => {
		//failure
		if (err) {
			if (err.name === 'IncorrectCredentialsError') {
				return res.status(400).json({
					success: false,
					message: err.message
				});
			}

			return res.status(400).json({
				success: false,
				message: 'Could not process the form*'
			});
		}
		//success
		return res.json({
			success: true,
			message: 'Login successful!',
			token,
			username: userData
		});
	})(req, res, next);
});

//create a route for wall submissions
router.post('/submit_wall', (req, res, next) => {
	const validationResult = validateWallForm(req.body);
	if (!validationResult.success) {
		return res.status(400).json({
			success: false,
			message: validationResult.message,
			errors: validationResult.errors
		});
	}
	(req, res, next);
});

module.exports = router;
