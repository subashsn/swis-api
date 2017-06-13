var errorMessage = require('../config/errorMessages.js')
var jwtSecret = require('../config/jwtSecret.js')
var User = require('../models/user.js')
var Video = require('../models/video.js')
var jwt = require('json-web-token')
var conf = require('../config/conf')

module.exports.initVideo = function(req,res){
	if(req.body.c_x&&req.body.c_y&&req.body.time_recorded){
		if((req.body.time_recorded> Date.now() - 24*60*60*1000)&&(req.body.time_recorded<Date.now())){
			Video.findOne({uploader_id: req.user_id, recordedAt: req.body.time_recorded},function(err,video){
				if(err){
					var errcode = "servererr"
					res.status(500).json({
						success: false,
						error: errcode,
						message: errorMessage[errcode]
					})						
				}else if(video){
					var errcode = "duplicatevideo"
					res.status(200).json({
						success: false,
						error: errcode,
						message: errorMessage[errcode]
					})						
				}else{
					var video = new Video()
					video.enabled=false;
					video.uploaded=false;
					video.recalled=false
					video.blocked=false;
					video.views=0;
					video.recordedAt=req.body.time_recorded
					video.uploader_id=req.user_id
					video.c_x=req.body.c_x
					video.c_y=req.body.c_y
					video.registeredAt = Date.now()
					video.save(function(err,vid){
						if(err||!vid){
							var errcode = "servererr"
							res.status(500).json({
								success: false,
								error: errcode,
								message: errorMessage[errcode]
							})								
						}else{
							var recAt = new Date(video.recordedAt)
							var uploadjson = {
								url: '/upload/video',
								file_name: vid._id,
								expiry: recAt.getTime() +24*60*60*1000
							}
							jwt.encode(jwtSecret,uploadjson,function(err,uploadtoken){
								if(err||!uploadtoken){
									var errcode = 'servererr'
									res.status(500).json({
										success: false,
										error: errcode,
										message: errorMessage[errcode]
									})		
								}else{
									res.status(200).json({
										success: true,
										videoid: vid._id,
										uploadtoken: uploadtoken
									})
								}
							})
						}	

					})

				}
			})
		}
		else{
			var errcode = "expiredvideo"
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
}

module.exports.initProfilePic = function(req,res){
	var uploadjson = {
		url: '/upload/profilepic',
		file_name : req.user_id,
		expiry: Date.now() + 24*60*60*1000
	}
	jwt.encode(jwtSecret,uploadjson,function(err,uploadtoken){
		if(err||!uploadtoken){
			var errcode = 'invalid'
			res.status(500).json({
				success: false,
				error: errcode,
				message: errorMessage[errcode]
			})		
		}else{
			res.status(200).json({
				success: true,
				uploadtoken: uploadtoken
			})
		}
	})
}

// !!!2 Implement check for video exist?
module.exports.confirmVideo = function (req,res){
	if(req.headers['serverToken']==conf.serverToken){
		console.log(req.headers['vid'] + 'yolo')
		Video.findById(req.headers['vid'],function(err,video){
			if(err||!video){
				var errcode = "servererr"
				res.status(500).json({
					success: false,
					error: errcode,
					message: errorMessage[errcode]
				})	
			}else{
				if (video.recordedAt> (Date.now() -24*60*60*1000)){
					video.uploaded= true
					video.uploadedAt = Date.now()
					video.enabled= true
					video.save()
					res.status(200).json({
						success: true
					})
				}else{
					var errcode = "expiredvideo"
					res.status(200).json({
						success: false,
						error: errcode,
						message: errorMessage[errcode]
					})						
				}
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

module.exports.deleteVideo = function (req,res){
	if(req.query.id){
		Video.findById(req.user_id,function(err,video){
			if(err||!video){
				var errcode = "servererr"
				res.status(500).json({
					success: false,
					error: errcode,
					message: errorMessage[errcode]
				})	
			}else{
				if (video.enabled&&!video.recalled){
					video.enabled= false
					video.recalled=true
					video.save()
					res.status(200).json({
						success: true
					})
				}else{
					var errcode = "alreadydisabled"
					res.status(200).json({
						success: false,
						error: errcode,
						message: errorMessage[errcode]
					})						
				}
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

