var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    bio: String,
    color: String,
    views: Number,
    status:{
    	verified: Boolean,
        profilepic: Boolean,
    	banned: Boolean
    },
    timestamps:{
    	created: Date,
    	verified: Date,
    	lastLogin: Date,
    	lastActivity: Date,
    },
    authtoken: String,
    location: String,
    followers: [String],
    followings: [String]
});

module.exports = mongoose.model('User', userSchema);