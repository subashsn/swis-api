var mongoose = require('mongoose')

var videoSchema = mongoose.Schema({
	enabled: Boolean,
	blocked: Boolean,
	recalled: Boolean,
	uploaded: Boolean,
    views: Number,
    uploader_id: mongoose.Schema.Types.ObjectId,
    c_x: Number,
    c_y: Number,
    recordedAt: Date,
    registeredAt: Date,
    uploadedAt: Date,
    dutation: Number
});

module.exports = mongoose.model('Video', videoSchema);