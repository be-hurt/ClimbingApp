var mongoose = require('mongoose');
var Wall = mongoose.model('Wall');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.commentsReadOne = function(req, res) {
	if (req.params && req.params.wallid) {
		Wall
			.findById(req.params._id)
			.exec(function(err, wall) {
				if (!wall) {
					sendJsonResponse(res, 404, {
						'message' : 'wallid not found'
					});
					return;
				} else if (err) {
					sendJsonResponse(res, 404, err);
					return
				} 
				sendJsonResponse(res, 200, wall);
			});
	} else {
		sendJsonResponse(res, 404, {'message': 'No wallid in request'});
	}
};

module.exports.createComment = function(req, res) {
	if (req.params.wallid) {
		Wall
			.findById(req.params.wallid)
			.select('comments')
			.exec(
				function(err, wall) {
					if(err) {
						sendJsonResponse(res, 400, err);
					} else {
						addComment(req, res, wall);
					}
				}
			);
	} else {
		sendJsonResponse(res, 404, {
			'message': 'Not found: wallid required'
		});
	}
};

const addComment = function(req, res, wall) {
	if(!wall) {
		sendJsonResponse(res, 404, {'message': 'wallid not found'});
	}
	else {
		wall.comments.push({
			author: req.body.author,
			date: new Date(),
			text: req.body.text
		});
		wall.save(function(err, wall) {
			let thisComment;
			if(err) {
				console.log(err);
				sendJsonResponse(res, 400, err);
			} else {
				thisComment = wall.comments[wall.comments.length - 1];
				sendJsonResponse(res, 201, thisComment);
			}
		});
	}
};

//add fucntionality for updating and deleting comments