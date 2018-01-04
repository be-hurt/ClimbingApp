var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.usersReadAll = function (req, res) {
	//retrieve all users from the database
	User.find(function(err, users) {
		if (err) 
			res.send(err);
 		//responds with a json object of all users.
 		res.json(users)
 	});
}