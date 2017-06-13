//Import necessary libs
var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan')
var bodyParser = require('body-parser')
var app = express();

var config = require('./config/conf.js')

//Connect to MongoDB
mongoose.connect('mongodb://localhost/test');

//Routes
var authRouter = require('./routes/auth.js');
var profileRouter = require('./routes/profile.js');
var discoverRouter = require('./routes/discover.js');
var infoRouter = require('./routes/info.js');
var fileRouter = require('./routes/file.js');

//Configure Modules
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: false }))

//Enable routing
app.use('/auth',authRouter)
app.use('/profile',profileRouter)
app.use('/discover',discoverRouter)
app.use('/info',infoRouter)
app.use('/file',fileRouter)

//Welcome route
app.get('/', function (req, res) {
  res.send('Hello from SWIS!');
});

//Start server
app.listen(config.PORT,config.HOST, function () {
  console.log('App serving on port '+ config.PORT);
});