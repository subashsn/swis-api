var express = require('express');
var authHandler = require('../core/authHandler.js')
var fileHandler = require('../core/fileHandler.js')

var router = express.Router();

router.post('/video/init',authHandler.authCheck,fileHandler.initVideo)

router.get('/profilepic/init',authHandler.authCheck,fileHandler.initProfilePic)

router.get('/video/confirm',fileHandler.confirmVideo)

router.get('/video/recall',authHandler.authCheck,fileHandler.deleteVideo)

module.exports = router;