var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// group schema
var groupSchema = new Schema({
	dateCreated : { type: Date, default: Date.now },
	name : String,
	admin : Number,
	users : [userSchema],
    messages : [messageSchema]
})

var Group = mongoose.model('Group', groupSchema);

// message schema
var messageSchema = new Schema({
	dateCreated : { type: Date, default: Date.now },
	content : String,
	lat : String,
	lon : String,
	users : [userSchema],
	creator : userSchema,
	found : Boolean
})

var Message = mongoose.model('Message', messageSchema);

// user schema
var userSchema = new Schema({
	name : { type: String, required: true },
	fbID : Number,
	photo : String,
    dateCreated : { type: Date, default: Date.now },
    friends : [String],
    groups : [groupSchema],
    messages : [messageSchema]
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