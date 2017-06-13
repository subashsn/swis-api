var express = require('express');
var authHandler = require('../core/authHandler.js')
var infoHandler = require('../core/infoHandler.js')

var router = express.Router();

router.post('/user',authHandler.authCheck ,infoHandler.getUserInfo)

router.post('/recentvideos', authHandler.authCheck,infoHandler.getRecentVideos)

router.post('/video', authHandler.authCheck,infoHandler.getVideoInfo)

module.exports = router;

// views , vid_id, up_id, up_name, 