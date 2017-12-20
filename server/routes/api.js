const express = require('express');
const router = express.Router();
const ctrlWalls = require('../controllers/walls');
const ctrlUsers = require('../controllers/users');
const ctrlComments = require('../controllers/comments');

//walls
router.get('/walls', ctrlWalls.wallsReadAll);
router.post('/walls', ctrlWalls.wallsCreate);
router.get('/walls/:wallid', ctrlWalls.wallsReadOne);

//comments
//router.post('/walls/:wallid/comments', ctrlComments.commentsCreate);
//router.get('/walls/:wallid/comments/:commentid', ctrlComments.commentsReadOne);
//router.put('/walls/:wallid/comments/:commentid', ctrlComment.commentsUpdateOne);
//router.delete('/walls/:wallid/comments/:commentid', ctrlComment.commentsDeleteOne);

//users
module.exports = router;