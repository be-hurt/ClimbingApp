const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//create the schema/Users database
const StatsSchema = new mongoose.Schema({
	completed: {type: [String]},
	favorites: {type: [String]}	
});

const UserSchema = mongoose.Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	stats: [StatsSchema]
});

//prepare methods
//method for checking if submitted password matches the corresponding one in the database
UserSchema.methods.comparePassword = function comparePassword(password, callback) {
	bcrypt.compare(password, this.password, callback);
};

//method for preparing new user to be submitted to the database
UserSchema.pre('save', function saveHook(next) {
	const user = this;

	//proceed only if password has been changed or user does not yet exist
	if (!user.isModified('password')) return next();

	//catch any errors that occur when generating the salt
	return bcrypt.genSalt((saltError, salt) => {
		if (saltError) {
			return next(saltError);
		}

		//catch any errors that occur when hashing
		return bcrypt.hash(user.password, salt, (hashError, hash) => {
			if (hashError) {
				return next(hashError);
			}

			//replace password with hash value to be submitted
			user.password = hash;
			return next();
		});
	});
});

const User = mongoose.model('User', UserSchema);
module.exports = User;