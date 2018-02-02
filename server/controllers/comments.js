var mongoose = require('mongoose');
var Wall = mongoose.model('Wall');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.commentsReadOne = function(req, res) {
	if (req.params && req.params.wallid && req.params.commentid) {
		Wall
			.findById(req.params.wallid)
			.select('comments')
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

				if(!wall.comments.id(req.params.commentid)) {
					sendJsonResponse(res, 404, {'message': 'commentid not found.'});
				} else {
					const comment  = wall.comments.id(req.params.commentid);
					sendJsonResponse(res, 200, comment);
				}
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
	} else if(!req.body.name || !req.body.id) {
		sendJsonResponse(res, 401, {'message': 'You must be logged in to post a comment. Please login and try again.'});
	} else if(req.body.comment.trim().length === 0) {
		sendJsonResponse(res, 400, {'message': 'The comment field must not be empty.'});
	}else {
		wall.comments.push({
			author: req.body.name,
			authorId: req.body.id,
			date: new Date(),
			text: req.body.comment
		});
		wall.save(function(err, wall) {
			let thisComment;
			if(err) {
				sendJsonResponse(res, 400, err);
			} else {
				thisComment = wall.comments[wall.comments.length - 1];
				sendJsonResponse(res, 201, {'successMessage': 'Comment submission successful!'});
			}
		});
	}
};

module.exports.commentsUpdateOne = function(req, res) {
	if(!req.params.wallid || !req.params.commentid || !req.body.user) {
		sendJsonResponse(res, 404, {'message': 'Not found: wallid, userid and commentid are required.'});
		return;
	} else if(!req.body.comment || req.body.comment.length < 1) {
		sendJsonResponse(res, 404, {'message': 'Comment field must not be empty.'});
	}

	Wall
		.findById(req.params.wallid)
		.select('comments')
		.exec(
			function(err, wall) {
				if(!wall) {
					sendJsonResponse(res, 404, {'message': 'wallid not found.'});
					return;
				} else if(err) {
					sendJsonResponse(res, 404, err);
					return;
				}
				if(wall.comments && wall.comments.length > 0) {
					const comment = wall.comments.id(req.params.commentid);
					if(!comment) {
						sendJsonResponse(res, 404, {'message': 'commentid not found.'});
					} else if(req.body.user !== comment.authorId){
						sendJsonResponse(res, 401, {'message': 'You are not authorized to edit this comment.'});
					} else {
						comment.text = req.body.comment;
						wall.save(function(err) {
							if(err) {
								sendJsonResponse(res, 404, err);
							} else {
								sendJsonResponse(res, 200, {'message': 'Comment successfully edited.'});
							}
						});
					}
				}
			}

		)
}

module.exports.commentsDeleteOne = function(req, res) {
	if(!req.params.wallid || !req.params.commentid || !req.body.userid) {
		sendJsonResponse(res, 404, {'message': 'Not found: wallid, userid and commentid are required.'});
		return;
	} 

	Wall
		.findById(req.params.wallid)
		.select('comments')
		.exec(
			function(err, wall) {
				if(!wall) {
					sendJsonResponse(res, 404, {'message': 'wallid not found.'});
					return;
				} else if(err) {
					sendJsonResponse(res, 404, err);
					return;
				}
				if(wall.comments && wall.comments.length > 0) {
					const comment = wall.comments.id(req.params.commentid);
					//make sure the commentid exists
					if(!comment) {
						sendJsonResponse(res, 404, {'message': 'commentid not found.'});
					} else if(req.body.userid !== comment.authorId){
						sendJsonResponse(res, 401, {'message': 'You are not authorized to delete this comment.'});
					} else {
						wall.comments.id(req.params.commentid).remove();
						wall.save(function(err) {
							if(err) {
								sendJsonResponse(res, 404, err);
							} else {
								sendJsonResponse(res, 200, {'message': 'Comment successfully deleted.'});
							}
						});
					}
				} else {
					sendJsonResponse(res, 404, {'message': 'No comment to delete.'});
				}
			}
		);
};