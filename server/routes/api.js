const express = require('express');
const router = express.Router();
const ctrlWalls = require('../controllers/walls');
const ctrlUsers = require('../controllers/users');
const ctrlComments = require('../controllers/comments');
const ctrlProgress = require('../controllers/progress');

//walls
router.get('/walls', ctrlWalls.wallsReadAll);
router.post('/walls', ctrlWalls.wallsCreate);
router.get('/walls/:wallid', ctrlWalls.wallsReadOne);

//comments
router.post('/walls/:wallid/comments', ctrlComments.createComment);
//router.get('/walls/:wallid/comments', ctrlComments.commentsReadAll);
router.get('/walls/:wallid/comments/:commentid', ctrlComments.commentsReadOne);
//router.put('/walls/:wallid/comments/:commentid', ctrlComment.commentsUpdateOne);
router.delete('/walls/:wallid/comments/:commentid', ctrlComments.commentsDeleteOne);

//users
router.get('/users', ctrlUsers.usersReadAll);
router.get('/users/:userid', ctrlUsers.usersReadOne);
router.put('/users/:userid/complete', ctrlUsers.usersUpdateCompletion);
router.get('/users/:userid/complete', ctrlUsers.usersCheckCompletion);
//note that all user post requests are handled by auth.js routes

//progress
router.get('/users/:userid/inProgress', ctrlProgress.progressReadAll);
router.get('/users/:userid/inProgress/wall/:wallid', ctrlProgress.progressReadOne);
router.post('/users/:userid/inProgress', ctrlProgress.createProgress);
router.put('/users/:userid/inProgress/:trackerid', ctrlProgress.updateProgress);
router.delete('/users/:userid/inProgress/:trackerid', ctrlProgress.deleteProgress);

module.exports = router;