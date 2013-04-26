var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// group schema
var groupSchema = new Schema({
	dateCreated : { type: Date, default: Date.now },
	name : String,
	admin : Number,
	users : [Number],
    messages : [Number]
})

var Group = mongoose.model('Group', groupSchema);

// message schema
var messageSchema = new Schema({
	dateCreated : { type: Date, default: Date.now },
	content : String,
	lat : String,
	lon : String,
	groups : [groupSchema],
	users : [userSchema],
	creator : String,
	found : Boolean
})

var Message = mongoose.model('Message', messageSchema);

// user schema
var userSchema = new Schema({
	name : { type: String, required: true },
	fbID : Number,
	geoloqiID : String,
	layerID : String,
	photo : String,
    dateCreated : { type: Date, default: Date.now },
    friends : [Number],
    invitedFriends : [Number],
    groups : [Number],
    messages : [Number]
})

var User = mongoose.model('User', userSchema);

// export models
module.exports = {
    Group: Group,
    Message: Message,
    User: User
};

// in index.js can reference like:
//var models = require('./schema');
//models.User.findOne(...