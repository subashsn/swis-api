var errorMessage = require('../config/errorMessages.js')
var jwtSecret = require('../config/jwtSecret.js')
var User = require('../models/user.js')
var jwt = require('json-web-token')
var bcrypt =require('bcrypt')

module.exports.authCheck = function(req,res,next){
	console.log(req.headers['accesstoken'])
	if(req.headers['accesstoken']){
		jwt.decode(jwtSecret, req.headers['accesstoken'], function(err,accessjson){
			if(!err){
				if(accessjson.expiry>=Date.now()){
					req.user_id=accessjson.user_id
					next()
				}else{
					console.log('unauthorized3')
					var errcode = "unauthorized"
					res.status(401).json({
						success: false,
						error: errcode,
						message: errorMessage[errcode]
					})						
				}

			}else{
				console.log('unauthorized2')
				var errcode = "unauthorized"
				res.status(401).json({
					success: false,
					error: errcode,
					message: errorMessage[errcode]
				})					
			}
		})
	}else{
		console.log('unauthorized1')
		var errcode = "unauthorized"
		res.status(401).json({
			success: false,
			error: errcode,
			message: errorMessage[errcode]
		})		
	}

}

module.exports.usernameAvailable = function (req,res){
	if(req.query.username){
		User.findOne({username: req.query.username}, function(err,user){
			if(err){
				var errcode = "servererr"
				res.status(500).json({
					success: false,
					error: errcode,
					message: errorMessage[errcode]
				})				
			}
			else if (user){
				res.status(200).json({
					success: true,
					available: false
				})
			}else {
				res.status(200).json({
					success: true,
					available: true
				})
			}
		})
	}
	else{
		var errcode = "invalid"
		res.status(400).json({
			success: false,
			error: errcode,
			message: errorMessage[errcode]
		})
	}
}

module.exports.emailAvailable = function (req,res){
	if(req.query.email){
		User.findOne({email: req.query.email}, function(err,user){
			if(err){
				var errcode = "servererr"
				res.status(500).json({
					success: false,
					error: errcode,
					message: errorMessage[errcode]
				})				
			}
			else if (user){
				res.status(200).json({
					success: true,
					available: false
				})
			}else {
				res.status(200).json({
					success: true,
					available: true
				})
			}
		})
	}
	else{
		var errcode = "invalid"
		res.status(400).json({
			success: false,
			error: errcode,
			message: errorMessage[errcode]
		})
	}
}

module.exports.signin = function (req,res){
	if(req.body.userid&&req.body.password){
		{
			User.findOne({$or: [{'email': req.body.userid},{'username' : req.body.userid}]},function(err,user){
				if(err){
					var errcode = "servererr"
					res.status(500).json({
						success: false,
						error: errcode,
						message: errorMessage[errcode]
					})				
				}
				//use bcrypt with promises instead
				else if(user&&bcrypt.compareSync(req.body.password, user.password)){
					var timestamp = Date.now()

					var authjson={
						user_id: user._id,
						type: 'auth'
					}
					var accessjson={
						user_id: user._id,
						type: 'access',
						expiry: timestamp + 2*24*60*60*1000
					}

					jwt.encode(jwtSecret, authjson, function(err,authtoken){
						if(err){
							var errcode = "servererr"
							res.status(500).json({
								success: false,
								error: errcode,
								message: errorMessage[errcode]
							})
						}
						else{
							jwt.encode(jwtSecret, accessjson, function(err,accesstoken){
								if(err){
									var errcode = "servererr"
									res.status(500).json({
										success: false,
										error: errcode,
										message: errorMessage[errcode]
									})
								}
								else{
									user.timestamps.lastLogin = timestamp;
									user.authtoken = authtoken
									user.save()
									res.status(200).json({
										success: true,
										authtoken : authtoken,
										accesstoken: accesstoken
									})
								}
							})
						}
					})
				}
				else{
					var errcode = "invalid"
					res.status(200).json({
						success: false,
						error: errcode,
						message: errorMessage[errcode]
					})				
				}
			})
		}
	}
	else{
		var errcode = "invalid"
		res.status(400).json({
			success: false,
			error: errcode,
			message: errorMessage[errcode]
		})
	}
}

module.exports.signup = function (req,res){
	if(req.body.username&&req.body.password&&req.body.email){
		{
			User.findOne({$or:[{'username':req.body.username},{'email':req.body.email}]},function(err,user){
				if(err){
					var errcode = "servererr"
					res.status(500).json({
						success: false,
						error: errcode,
						message: errorMessage[errcode]
					})					
				}
				else if(user){
					var errcode = "existinguser"
					res.status(200).json({
						success: false,
						error: errcode,
						message: errorMessage[errcode]
					})						
				}
				else{
					//use bcrypt with promises instead
					var hashedPass = bcrypt.hashSync(req.body.password, 10);
					var user = new User()
					var timestamp = Date.now()
					user.username = req.body.username
					user.email = req.body.email
					user.password = hashedPass
					user.name = "Anonymous"
					user.bio = "Hey there, I am using SWIS!"
					user.color = "0"
					user.views = 0
					user.status.verified=false
					user.status.profilepic=false
					user.status.banned=false
					user.timestamps.created = timestamp
					user.timestamps.lastLogin = timestamp
					user.location="Earth"
					user.followers=[]
					user.followings=[]
					// could just use a random string instead of jwt for authToken
					var authjson={
						user_id: user._id,
						type: 'auth'
					}
					var accessjson={
						user_id: user._id,
						type: 'access',
						expiry: timestamp + 2*24*60*60*1000
					}
					jwt.encode(jwtSecret, authjson, function(err,authtoken){
						if(err){
							var errcode = "servererr"
							res.status(500).json({
								success: false,
								error: errcode,
								message: errorMessage[errcode]
							})
						}
						else{
							jwt.encode(jwtSecret, accessjson, function(err,accesstoken){
								if(err){
									var errcode = "servererr"
									res.status(500).json({
										success: false,
										error: errcode,
										message: errorMessage[errcode]
									})
								}
								else{
									user.authtoken = authtoken
									user.timestamps.lastLogin =timestamp
									user.save()
									res.status(200).json({
										success: true,
										authtoken : authtoken,
										accesstoken: accesstoken
									})
								}
							})
						}
					})
				}					

			})
		}
	}
	else{
		var errcode = "invalid"
		res.status(400).json({
			success: false,
			error: errcode,
			message: errorMessage[errcode]
		})
	}
}

// !!!1 Need Error Handling
module.exports.getaccesstoken = function (req,res){
	if(req.body.authtoken){
		jwt.decode(jwtSecret, req.body.authtoken, function(err,authjson){
			if(!err){
				User.findOne({authtoken:req.body.authtoken},function(err,user){
					if(!err&&user){
						var timestamp = Date.now()
						console.log((timestamp- 60*24*60*60*1000),user.timestamps.lastLogin)
						if(!((timestamp- 60*24*60*60*1000) > user.timestamps.lastLogin)){
							var accessjson={
								user_id: user._id,
								type: 'access',
								expiry: timestamp + 2*24*60*60*1000
							}
							user.timestamps.lastLogin = timestamp
							user.save()
							jwt.encode(jwtSecret, accessjson, function(err,accesstoken){
								if(!err){
									res.status(200).json({
										success: true,
										accesstoken: accesstoken
									})
								}
							})								
						}else{
							var errcode = "expiredtoken"
							res.status(200).json({
								success: false,
								error: errcode,
								message: errorMessage[errcode]
							})
						}
					}else{
						var errcode = "invalid"
						res.status(400).json({
							success: false,
							error: errcode,
							message: errorMessage[errcode]
						})						
					}
				})
			}else{
				var errcode = "invalid"
				res.status(400).json({
					success: false,
					error: errcode,
					message: errorMessage[errcode]
				})
			}
		})
	}
	else{
		var errcode = "invalid"
		res.status(400).json({
			success: false,
			error: errcode,
			message: errorMessage[errcode]
		})
	}
}