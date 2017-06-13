var errorMessage = require('../config/errorMessages.js')
var User = require('../models/user.js')
var Video = require('../models/video.js')

module.exports.syncProfile = function (req,res){
	User.findById(req.user_id,function(err,user){
		if(err){
			var errcode = "invalid"
			res.status(500).json({
				success: false,
				error: errcode,
				message: errorMessage[errcode]
			})
		}
		else if(user){
			Video.find({uploader_id: user._id},'_id enabled blocked recalled uploaded c_x c_y views recordedAt',function(err2,videos){
				if(!err){
					res.status(200).json({
						success: true,
						id: user._id,
						color: user.color,
						name: user.name,
						username: user.username,
						profilepic: user.status.profilepic,
						email: user.email,
						location: user.location,
						views: user.views,
						bio: user.bio,
						banned: user.status.banned,
						followers: user.followers,
						followings: user.followings,
						videos: videos
					})						
				}else{
					var errcode = "invalid"
					res.status(500).json({
						success: false,
						error: errcode,
						message: errorMessage[errcode]
					})					
				}			
			})


		}
		else{
			var errcode = "invalid"
			res.status(500).json({
				success: false,
				error: errcode,
				message: errorMessage[errcode]
			})			
		}
	})
}

module.exports.updateProfile = function(req,res){
	User.findById(req.user_id,function(err,user){
		if(!err&&user){
			var flag =0;
			if(req.body.loacation){
				user.location = req.body.location
				flag=1
			}
			if(req.body.bio){
				user.bio = req.body.bio
				flag=1
			}
			if(req.body.color){
				user.color = req.body.color
				flag=1
			}
			if(req.body.name){
				user.name = req.body.name
				flag=1
			}
			if(flag==1){
				user.save()
				res.status(200).json({
					success: true
				})
			}else{
				var errcode = "invalid"
				res.status(400).json({
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
}

module.exports.followUsers = function(req,res){
	if(req.body.userid){
		if( typeof req.body.userid === 'string' ) {
		    req.body.userid = [ req.body.userid ];
		}
		if(req.body.userid.length){
			User.findById(req.user_id,function(err,user){
				if(!err&&user){
					console.log(user.id)
					User.find({_id: {$in: req.body.userid}},function (err2,users){
						if(!err2&&users){
							for (i = 0; i < users.length; i++) { 
							    if ((user.followings.indexOf(users[i]._id) == -1)&&!(user.id==users[i].id)) {
							        user.followings.push(users[i]._id);
							        users[i].followers.push(user._id)
							        users[i].save()
							    }
							}
						    user.save()
						    res.status(200).json({
						    	success: true
						    })
						    return							
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
			})
		}
	}else{
		var errcode = "invalid"
		res.status(400).json({
			success: false,
			error: errcode,
			message: errorMessage[errcode]
		})
		return		
	}	
}

module.exports.unfollowUsers = function(req,res){
	if(req.body.userid){
		if( typeof req.body.userid === 'string' ) {
		    req.body.userid = [ req.body.userid ];
		}
		if(req.body.userid.length){
			User.findById(req.user_id,function(err,user){
				if(!err&&user){
					console.log(user.id)
					User.find({_id: {$in: req.body.userid}},function (err2,users){
						if(!err2&&users){
							for (i = 0; i < users.length; i++) { 
							    if ((user.followings.indexOf(users[i]._id) != -1)&&!(user.id==users[i].id)) {
							        user.followings.pop(users[i]._id);
							        users[i].followers.pop(user._id)
							        users[i].save()
							    }
							}
						    user.save()
						    res.status(200).json({
						    	success: true
						    })
						    return							
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
			})
		}
	}else{
		var errcode = "invalid"
		res.status(400).json({
			success: false,
			error: errcode,
			message: errorMessage[errcode]
		})
		return		
	}	
}	
