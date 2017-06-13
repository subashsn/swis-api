var express = require('express');
var authHandler = require('../core/authHandler.js')

var router = express.Router();

router.get('/usernameavailable',authHandler.usernameAvailable)

router.get('/emailavailable',authHandler.emailAvailable)

router.post('/signin',authHandler.signin)

router.post('/signup',authHandler.signup)

router.post('/getaccesstoken',authHandler.getaccesstoken)

module.exports = router;