var express = require('express');
var authHandler = require('../core/authHandler.js')
var discoverHandler = require('../core/discoverHandler.js')

var router = express.Router();

router.get('/markers',authHandler.authCheck,discoverHandler.getMarkers)

router.get('/followingvideos',authHandler.authCheck,discoverHandler.getFollowingVideos)

module.exports = router;