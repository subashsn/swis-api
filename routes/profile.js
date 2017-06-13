var express = require('express');
var User = require('../models/user.js')
var authHandler = require('../core/authHandler.js')
var profileHandler = require('../core/profileHandler.js')


var router = express.Router();

router.get('/syncprofile',authHandler.authCheck,profileHandler.syncProfile)

router.post('/update',authHandler.authCheck,profileHandler.updateProfile)

router.post('/follow',authHandler.authCheck,profileHandler.followUsers)

router.post('/unfollow',authHandler.authCheck,profileHandler.unfollowUsers)

module.exports = router;