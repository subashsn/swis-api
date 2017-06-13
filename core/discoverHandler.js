var errorMessage = require('../config/errorMessages.js')
var Video = require('../models/video.js')
var User = require('../models/user.js')
module.exports.getMarkers = function (req,res){
	Video.find({enabled:true},'c_x c_y id ',function(err,markers){
		if(!err){
			res.status(200).json(markers)			
		}else{
			var errcode = "servererr"
			res.status(500).json({
				success: false,
				error: errcode,
				message: errorMessage[errcode]
			})	
		}

	})
}

module.exports.getFollowingVideos = function (req,res){
	User.findById(req.user_id,function(err,user){
		if(!err&&user){
			Video.find({$and:[{'enabled':true},{'uploader_id':{ $in: user.followings}}]},'c_x c_y uploader_id _id ',function(err2,markers){
				if(!err2){
					res.status(200).json(markers)			
				}else{
					console.log(err2)
					var errcode = "servererr"
					res.status(500).json({
						success: false,
						error: errcode,
						message: errorMessage[errcode]
					})	
				}
			})
		}else{
			var errcode = "servererr"
			res.status(500).json({
				success: false,
				error: errcode,
				message: errorMessage[errcode]
			})	
		}

	})
}