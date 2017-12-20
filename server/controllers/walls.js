var mongoose = require('mongoose');
var Wall = mongoose.model('Wall');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.wallsReadOne = function (req, res) {
	if (req.params && req.params.wallid) {
		Wall
			.findById(req.params.wallid)
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

module.exports.wallsReadAll = function (req, res) {
	//retrieve all walls from the database
	//access Walls schema
	Wall.find((err, walls) => {
		if (err) {
			res.send(err);
		}
		//respond with a json object of our database Walls
		res.json(walls)
	});
}

module.exports.wallsCreate = function (req, res) {
	Wall.create({
		name: req.body.name,
		date: new Date(),
		difficulty: req.body.difficulty,
		rating: 0,
		description: req.body.description,
		image: req.body.image
	}, function(err, wall) {
		if(err) {
			sendJsonResponse(res, 400, err);
		} else {
			sendJsonResponse(res, 200, wall);
		}
	});
};
