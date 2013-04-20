
/*
 * routes/index.js
 * 
 * Routes contains the functions (callbacks) associated with request urls.
 */

var request = require('request'); // library to make requests to remote urls
var moment = require("moment"); // date manipulation library
var models = require("../models/models.js"); //db model
//models.User.findOne(...
//models.Group.findOne(...
//models.Message.findOne(...

var geoloqi = require('geoloqi');
var session = new geoloqi.Session({'access_token':'b42e8-c72955a7abd906a5a3b7f90d58ebfba4998d3cf5'});	

/*
	GET /
*/
// API route to return all users
exports.returnAllUserData = function(req, res) {

    // query for all users
    var userQuery = models.User.find({}); // quarey for all users
    userQuery.exec(function(err, allUsers){

        // prepare data for JSON
        var jsonData = {
            status : 'OK',
            users : allUsers
        }
        // respond with JSON
        res.json(jsonData);
    });
}

// API route to return all messages
exports.returnAllMsgData = function(req, res) {

    // query for all messages
    var msgQuery = models.Message.find({}); // quarey for all users
    msgQuery.exec(function(err, allMsgs){

        // prepare data for JSON
        var jsonData = {
            status : 'OK',
            messages : allMsgs
        }
        // respond with JSON
        res.json(jsonData);
    });
}

// API route to return all groups
exports.returnAllGrpData = function(req, res) {

    // query for all users
    var grpQuery = models.Group.find({}); // quarey for all users
    grpQuery.exec(function(err, allGroups){

        // prepare data for JSON
        var jsonData = {
            status : 'OK',
            groups : allGroups
        }
        // respond with JSON
        res.json(jsonData);
    });
}

// API route to return a specific user info
exports.returnUserData = function(req, res) {

	console.log("details requested for " + req.params.user_id);

	//get the requested user by the param on the url :user_id
	var user_id = req.params.user_id;

	// query the database for that user
	var userQuery = models.User.findOne({_id:user_id});
	userQuery.exec(function(err, currentUser){

		if (err) {
			return res.status(500).send("There was an error on this user query");
		}

		if (currentUser == null) {
			return res.status(404).render('404.html');
		}
		
		//prepare JSON data for response
		var jsonData = {
			user : currentUser,
			status : 'OK'
		}

		// return JSON to requestor
		res.json(jsonData);

	});
}

// API route to return a specific message info
exports.returnMsgData = function(req, res) {

	console.log("details requested for " + req.params.msg_id);

	//get the requested message by the param on the url :msg_id
	var msg_id = req.params.msg_id;

	// query the database for that message
	var msgQuery = models.Message.findOne({_id:msg_id});
	msgQuery.exec(function(err, currentMsg){

		if (err) {
			return res.status(500).send("There was an error on this message query");
		}

		if (currentMsg == null) {
			return res.status(404).render('404.html');
		}
		
		//prepare JSON data for response
		var jsonData = {
			message : currentMsg,
			status : 'OK'
		}

		// return JSON to requestor
		res.json(jsonData);

	});
}

// API route to return a specific group info
exports.returnGrpData = function(req, res) {

	console.log("details requested for " + req.params.grp_id);

	//get the requested group by the param on the url :grp_id
	var grp_id = req.params.grp_id;

	// query the database for that group
	var grpQuery = models.Group.findOne({_id:grp_id});
	grpQuery.exec(function(err, currentGrp){

		if (err) {
			return res.status(500).send("There was an error on this group query");
		}

		if (currentGrp == null) {
			return res.status(404).render('404.html');
		}
		
		//prepare JSON data for response
		var jsonData = {
			group : currentGrp,
			status : 'OK'
		}

		// return JSON to requestor
		res.json(jsonData);

	});
}

//API route to create new user entity
exports.addUser = function(req, res) {

	console.log("received new user addition");
	console.log(req.body);

	// need a variable to store the user's geoloqi ID
	var geoloqiID;

	// create an account at geoloqi
	session.post('/user/create_anon', {
	  "client_id": "d9c602b6c0c651ecf4bfd9db88b5acf1",
	  "client_secret": "ebfb1e4eb1de784c30af5920f3345944",
	  "key": req.body.fbID
	}, function(result, err) {
	  if(err) {
	    throw new Error('There has been an error! '+err);
	  } else {
	    console.log(result.access_token);
	    geoloqiID = result.access_token;
	  }
	});

	// accept HTTP post data
	newUser = new models.User();
		newUser.name = req.body.name;
		newUser.fbID = req.body.fbID;
		newUser.photo = req.body.photo;
		newUser.geoloqiID = geoloqiID;

	// save the newUser to the database
	newUser.save(function(err){
		if (err) {
			console.error("Error on saving new user");
			console.error("err");
			return res.send("There was an error when creating the new user");

		} else {
			console.log("Created a new user!");
			console.log(newUser);
			res.json({ id: newUser._id });
		}

	});

}

//API route to create new user entity
exports.addGroup = function(req, res) {

	console.log("received new group addition");
	console.log(req.body);

	// accept HTTP post data
	newGroup = new models.Group();
		newGroup.name = req.body.name;
		newGroup.adminID = req.body.adminID;
		newGroup.users = req.body.users;

	// save the newGroup to the database
	newGroup.save(function(err){
		if (err) {
			console.error("Error on saving new group");
			console.error("err");
			return res.send("There was an error when creating the new group");

		} else {
			console.log("Created a new group!");
			console.log(newGroup);
			res.json({ id: newGroup._id });
		}

	});

}

//API route to create new msg entity
exports.addMsg = function(req, res) {

	console.log("received new message addition");
	console.log(req.body);

	// accept HTTP post data
	newMsg = new models.Message();
		newMsg.content = req.body.content;
		newMsg.lat = req.body.lat;
		newMsg.lon = req.body.lon;
		newMsg.users = req.body.users;
		newMsg.creator = req.body.creator;
		newMsg.found = false;


	// save the newMsg to the database
	newMsg.save(function(err){
		if (err) {
			console.error("Error on saving new message");
			console.error("err");
			return res.send("There was an error when creating the new message");

		} else {
			console.log("Created a new message!");
			console.log(newMsg);
			res.json({ id: newMsg._id });
		}

	});

}




