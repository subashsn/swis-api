var errorMessage = require('../config/errorMessages.js')
var User = require('../models/user.js')
var Video = require('../models/video.js')

module.exports.getUserInfo = function(req,res){
	if(req.body.userId){
		if( typeof req.body.userId === 'string' ) {
		    req.body.userId = [ req.body.userId ];
		}
		/*User.aggregate([{$match:{_id:{$in:req.body.userid}}},{$project:{numfollowers:{$size:'$followers'},numfollowings:{$size:'$followings'},id:'$_id',name:'$name',bio:'$bio',location:'$location',profilepic:'$profilepic',username:'$username',color:'$color'}}],function(err,users){
			if(err){
				console.log(err)
			}
			res.status(200).json(users)
		})*/	
		User.find({_id:{$in:req.body.userId}},function(err,users){
			var resArray = []
			if(!err&&users){
				for(i=0;i<users.length;i++){
					var userJson={}
					userJson.id = users[i]._id
					userJson.followingCount = users[i].followings.length
					userJson.followersCount = users[i].followers.length
					userJson.location = users[i].location
					userJson.bio = users[i].bio
					userJson.name = users[i].name
					userJson.views = users[i].views
					userJson.username = users[i].username
					resArray.push(userJson)
				}
				res.status(200).json({
					success: true,
					users:resArray
				})
			}else{
				var errcode = "invalid"
				res.status(200).json({
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
}

module.exports.getRecentVideos = function (req,res){
	resArray = []
	if(req.body.userId){
		Video.find({uploader_id: req.body.userId,enabled: true},function(err,videos){
			for(var i=0;i<videos.length;i++){
				vidJson ={}
				vidJson.videoId = videos[i].id
				vidJson.views= videos[i].views
				vidJson.timeRemaining= ((videos[i].recordedAt - Date.now()) +24*60*60*1000)
				resArray.push(vidJson)	
			}
			res.status(200).json(resArray)
		})
	}else{
		var errcode = "invalid"
		res.status(400).json({
			success: false,
			error: errcode,
			message: errorMessage[errcode]
		})
	}
	
}

module.exports.getVideoInfo = function (req,res){
	if(req.body.videoId){
		Video.findById(req.body.videoId,function(err,video){
			if(err||(!video)){
				var errcode = "invalid"
				res.status(200).json({
					success: false,
					error: errcode,
					message: errorMessage[errcode]
				})			
			} else if(video){
				User.findById(video.uploader_id,function(err,user){
					if(err||(!user)){
						var errcode = "invalid"
						res.status(200).json({
							success: false,
							error: errcode,
							message: errorMessage[errcode]
						})						
					}else{
						res.status(200).json({
							uploader: {
								id: user._id,
								name: user.name,
								username: user.username,
								followersCount: user.followers.length,
								followingsCount: user.followings.length,
								views: user.views,
								location: user.location,
								bio: user.bio
							},
							video: {
								views: video.views,
								timeRemaining: ((video.recordedAt - Date.now()) +24*60*60*1000)
							}
						})
					}
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
}