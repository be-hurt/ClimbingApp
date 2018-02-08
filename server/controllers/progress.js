var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.progressReadAll = function(req, res) {
	if(req.params && req.params.userid) {
		User
			.findById(req.params.userid)
			.select('inProgress')
			.exec(
				function (err, user) {
					if(!user) {
						sendJsonResponse(res, 404, {'message' : 'userid not found'});
					} else if(err) {
						sendJsonResponse(res, 404, err);
					} 
					if(user.inProgress && user.inProgress.length > 0) {
						sendJsonResponse(res, 200, user.inProgress);
					} else {
						//no progress being tracked for this user
						sendJsonResponse(res, 404, {'message': 'No progress is being tracked for this user.'});
					}
				}
			);
	} else {
		sendJsonResponse(res, 404, {'message': 'No userid in request'});
	}
};

//see if there is a tracker for a specific wall
module.exports.progressReadOne = function(req, res) {
	if(req.params && req.params.userid) {
		User
			.findById(req.params.userid)
			.select('inProgress')
			.exec(
				function(err, user) {
					let tracker;
					if(!user) {
						sendJsonResponse(res, 400, {'message': 'You must be logged in to view your progress.'});
						return;
					} else if(err) {
						sendJsonResponse(res, 400, err);
						return;
					}
					if(user.inProgress && user.inProgress.length >= 1 ) {
						for (let i=0; i < user.inProgress.length; i++) {
							if(user.inProgress[i].wall === req.params.wallid) {
								tracker = user.inProgress[i];
							}
						}
						if(tracker) {
							sendJsonResponse(res, 200, tracker);
						} else {
							sendJsonResponse(res, 204, {'message': 'This wall has not been started.'});
						}
					} else {
						sendJsonResponse(res, 204, {'message': 'No progress trackers found.'});
					}
				}
			);
	} else {
		sendJsonResponse(res, 404, {'message': 'Not found: userid and wallid are required.'})
	}
};

module.exports.createProgress = function(req, res) {
	if (req.params.userid) {
		User
			.findById(req.params.userid)
			.select('inProgress')
			.exec(
				function(err, user) {
					if(err) {
						sendJsonResponse(res, 400, err);
					} else {
						addProgress(req, res, user);
					}
				}
			);
	} else {
		sendJsonResponse(res, 404, {
			'message': 'Not found: userid required'
		});
	}
};

const addProgress = function(req, res, user) {
	if(!user) {
		sendJsonResponse(res, 404, {'message': 'userid not found'});
	} else if(!req.body.wall) {
		sendJsonResponse(res, 401, {'message': 'wallid not found.'});
	} else {
		user.inProgress.push({
			wall: req.body.wall,
			name: req.body.name,
			completionPercentage: req.body.percent,
			completed: req.body.complete
		});
		user.save(function(err, user) {
			let thisProgress;
			if(err) {
				console.log(err);
				sendJsonResponse(res, 400, err);
			} else {
				thisProgress = user.inProgress[user.inProgress.length - 1];
				sendJsonResponse(res, 201, {'message': 'Progress tracking update successful!'});
			}
		});
	}
};

module.exports.updateProgress = function(req, res) {
	if(!req.params.userid || !req.params.trackerid || !req.body.wallid) {
		sendJsonResponse(res, 404, {'message': 'Not found: userid, trackerid and wallid required'});
		return;
	}

	User
		.findById(req.params.userid)
		.select('inProgress')
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
				if(user.inProgress && user.inProgress.length > 0) {
					thisTracker = user.inProgress.id(req.params.trackerid);
					if(!thisTracker) {
						//id does not exist/cannot be found
						sendJsonResponse(res, 404, {'message': 'trackerid not found.'});
					} else {
						//success
						thisTracker.wall = req.body.wallid;
						thisTracker.completionPercentage = req.body.percent;
						thisTracker.completed = req.body.complete;
						user.save(function(err, user) {
							if(err) {
								sendJsonResponse(res, 404, {'errors': err });
							} else {
								sendJsonResponse(res, 200, thisTracker);
							}
						});
					}
				} else {
					sendJsonResponse(res, 404, {'message': 'No progress tracker to update.'});
				}
			}
		);
};

module.exports.deleteProgress = function(req, res) {
	if(!req.params.userid || !req.params.trackerid) {
		sendJsonResponse(res, 404, {'message': 'Not found: userid and trackerid are both required.'});
		return;
	} 

	User
		.findById(req.params.userid)
		.select('inProgress')
		.exec(
			function(err, user) {
				if(!user) {
					sendJsonResponse(res, 404, {'message': 'userid not found.'});
					return;
				} else if(err) {
					sendJsonResponse(res, 404, err);
					return
				}
				if(user.inProgress && user.inProgress.length > 0) {
					//make sure the trackerid exists
					if(!user.inProgress.id(req.params.trackerid)) {
						sendJsonResponse(res, 404, {'message': 'trackerid not found.'});
					} else {
						user.inProgress.id(req.params.trackerid).remove();
						user.save(function(err) {
							if(err) {
								sendJsonResponse(res, 404, err);
							} else {
								sendJsonResponse(res, 204, {'message': 'progress tracker removed.'});
							}
						});
					}
				} else {
					sendJsonResponse(res, 404, {'message': 'No progress tracker to delete.'});
				}
			}
		);
};