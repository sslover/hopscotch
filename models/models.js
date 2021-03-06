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
	users : [String],
	creator : String,
	found : Boolean
})

var Message = mongoose.model('Message', messageSchema);

var triggerSchema = new Schema ({
	triggerID : String,
	placeID : String,
	text : String,
	radius : Number,
	type : String
})

var Trigger = mongoose.model('Trigger', triggerSchema);

// place schema to define the user's message locations
var placeSchema = new Schema({
	placeID : String,
	messageID : Number,
	content : String,
	lat : String,
	lon : String,
	trigger : String
})

var Place = mongoose.model('Place', placeSchema);

// user schema
var userSchema = new Schema({
	name : { type: String, required: true },
	fbID : Number,
	geoloqiTOKEN : String,
	geoloqiUserID : String,
	layerID : String,
	photo : String,
    dateCreated : { type: Date, default: Date.now },
    friends : [Number],
    invitedFriends : [Number],
    groups : [Number],
    messages : [placeSchema]
})

var User = mongoose.model('User', userSchema);

// export models
module.exports = {
    Group: Group,
    Message: Message,
    Place: Place,
    Trigger: Trigger,
    User: User
};

// in index.js can reference like:
//var models = require('./schema');
//models.User.findOne(...