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

module.exports.usersReadOne = function(req, res) {
	//retrieve a single users' info from the database
	if (req.params && req.params.userid) {
		User
			.findById(req.params.userid)
			.exec(function(err, user) {
				if (!user) {
					sendJsonResponse(res, 404, {
						'message' : 'userid not found'
					});
					return;
				} else if (err) {
					sendJsonResponse(res, 404, err);
					return
				} 
				sendJsonResponse(res, 200, user);
			});
	} else {
		sendJsonResponse(res, 404, {'message': 'No userid in request'});
	}
};

module.exports.usersUpdateCompletion = function(req, res) {
	//update a single user's completed walls
	if(!req.params.userid || !req.body.wallid) {
		sendJsonResponse(res, 404, {'message': 'Not found: userid and wallid required'});
		return;
	}

	User
		.findById(req.params.userid)
		.select('completed')
		.exec(
			function(err, user) {
				var thisTracker;
				if(!user) {
					sendJsonResponse(res, 404, {'message': 'userid not found'});
					return;
				} else if(err) {
					sendJsonResponse(res, 400, {'errors': err});
					return;
				}
				if(user.completed && user.completed.length > 0) {
					thisCompleted = user.completed.id(req.params.completedid);
					if(!thisCompleted) {
						//id does not exist/cannot be found
						sendJsonResponse(res, 404, {'message': 'completedid not found.'});
					} else {
						//success
						thisCompleted.wall = req.body.wallid;
						thisCompleted.name = req.body.name;
						user.save(function(err, user) {
							if(err) {
								sendJsonResponse(res, 404, {'errors': err });
							} else {
								sendJsonResponse(res, 200, thisCompleted);
							}
						});
					}
				} else {
					sendJsonResponse(res, 404, {'message': 'No progress tracker to update.'});
				}
			}
		);
};

module.exports.usersCheckCompletion = function(req, res) {
	//return array of walls completed by user
	//retrieve a single users' info from the database
	if (req.params && req.params.userid) {
		User
			.findById(req.params.userid)
			.select('completed')
			.exec(function(err, user) {
				if (!user) {
					sendJsonResponse(res, 404, {
						'message' : 'userid not found'
					});
					return;
				} else if (err) {
					sendJsonResponse(res, 404, err);
					return
				} 
				sendJsonResponse(res, 200, user);
			});
	} else {
		sendJsonResponse(res, 404, {'message': 'No userid in request'});
	}
};