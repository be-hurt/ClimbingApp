var mongoose = require('mongoose');
var Wall = mongoose.model('Wall');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.commentsReadOne = function (req, res) {
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