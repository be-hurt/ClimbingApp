//import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const User = require('./server/model/users');
const Wall = require('./server/model/walls');

//require server routes
const routesApi = require('./server/routes/api');

//require server controllers
const ctrlWalls = require('./server/controllers/walls');

//import database credentials for connection
const credentials = require('./credentials');

//create instances
const app = express();
var router = express.Router();

//set port for api
const api_port = process.env.API_PORT || 3001;

//db config
mongoose.connect(credentials.mongo.development.connectionString);

//configure the API to use bodyparser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set 
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
 	res.setHeader('Access-Control-Allow-Credentials', 'true');
 	res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 	res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
	//remove cacheing so the page can update with the most recent walls/comments
	res.setHeader('Cache-Control', 'no-cache');
	next();
});

/*USER AUTHENTICATION START*/
//use passport middleware
app.use(passport.initialize());

//load passport strategies (set in server/passport)
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

//pass the authentication checker middleware
const authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/status', authCheckMiddleware);

//routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/status', apiRoutes);
/*AUTHENTICATION END*/

router.get('/', function(req, res) {
	res.json({ message: 'API Initialized!'});
})

//use our router configuration when we call /api
app.use('/api', router);
app.use('/api', routesApi);

//start the server and listen for requests
app.listen(api_port, () => {
	console.log('api running on port ' + api_port);
});