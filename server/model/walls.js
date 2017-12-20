const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
	author: {type: String, required: true},
	date: {type: Date, required: true},
	text: {type: String, required: true}
});

const WallSchema = new mongoose.Schema({
	name: {type: String, required: true, unique: true},
	date: {type: Date, required: true},
	difficulty: {type: Number, required: true},
	rating: Number,
	description: String,
	image: String,
	comments: [CommentSchema]
});

const Wall = mongoose.model('Wall', WallSchema);
module.exports = Wall;