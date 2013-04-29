
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
var accessToken = "b42e8-c72955a7abd906a5a3b7f90d58ebfba4998d3cf5";

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

	console.log("received a user request");
	console.log(req.body);

	var userID; // this is a variable in the function needed to map the user properly
	var geoTOKEN; // need this to authenticate the user

	//see if the user is new or not by checking their unique FB ID
	var fb_id = req.body.fbID;
	// query the database for that user
	var userFBQuery = models.User.findOne({fbID:fb_id});
	userFBQuery.exec(function(err, currentUser){

		if (err) {
			return res.status(500).send("There was an error on this user query");
		}

		//if the currentUser exists, send back the details
		if (currentUser) {
			console.log("we have an existing user!");
			//else if they do exist, prepare JSON data for response
			var jsonData = {
				id : currentUser._id,
				geoloqiTOKEN : currentUser.geoloqiTOKEN
			}
			// send back user details to requestor
			res.json({ id : currentUser._id,
				geoloqiTOKEN : currentUser.geoloqiTOKEN,
				geoloqiUserID : currentUser.geoloqiUserID			
				});
		}
	
		// else, if they are new, add them
		else {
			console.log("we have a new user!");
			addNewUser();
		}
	});

	function addNewUser (){
	// save the user to the database first
		newUser = new models.User();
			newUser.name = req.body.name;
			newUser.fbID = req.body.fbID;
			newUser.photo = req.body.photo;

		// save the newUser to the database
		newUser.save(function(err){
			if (err) {
				console.error("Error on saving new user");
				console.error("err");
				return res.send("There was an error when creating the new user");

			} else {
				console.log("Created a new user!");
				console.log(newUser);
			}

		});
	//now, let's get them an account in the geoloqi system
	session.post('/user/create_anon', {
	  "client_id": "d9c602b6c0c651ecf4bfd9db88b5acf1",
	  "client_secret": "ebfb1e4eb1de784c30af5920f3345944",
	  "key": newUser._id
	}, function(result, err) {
	  if(err) {
	    throw new Error('There has been an error! in user/create_anon '+err);
	  } else {
		    console.log("USER CREATED RESPONSE");
		    console.log(result);
		    geoTOKEN = result.access_token;
		    userID = result.user_id;
		    console.log("geoloqiTOKEN is " + geoTOKEN);
		    console.log("userID is " + result.user_id);
				var updatedData = {
				geoloqiTOKEN : geoTOKEN,
				geoloqiUserID : userID  
			}
			models.User.update({_id:newUser._id}, { $set: updatedData}, function(err, user){
				if (err) {
					console.error("ERROR: While adding geoloqi");
					console.error(err);			
				}
				res.json({ id: newUser._id,
						geoloqiTOKEN : geoTOKEN,
						geoloqiUserID : userID 			
				 });	
			}) 
	  	createLayer();
	  	}
	});
	function createLayer(){
	// now, let's give them a unique layerID that will hold all their messages
	session.post('/layer/create', {
	  "key": newUser._id,
	  "public": 1,
	  "name": newUser.name
	}, function(result, err) {
	  if(err) {
	    throw new Error('There has been an error! in layer/create'+err);
	  } else {
		    var layID = result.layer_id;
		 	console.log("layerID is " + layID);
				var updatedData = {
				layerID : layID,
			}
			models.User.update({_id:newUser._id}, { $set: updatedData}, function(err, user){
				if (err) {
					console.error("ERROR: While adding layerID");
					console.error(err);			
				}
			}) 
	  		console.log("the user ID that we are subscribing to this layer is " + userID + " and the geoloqiTOKEN is " + geoTOKEN);
	  		console.log("the layer URL is layer/subscribe/" + layID);
	  		//let's subscribe the user to the layer
			session.post('layer/subscribe/' + layID, {
			  "Authorization": "OAuth " + geoTOKEN,
			  "user_id": userID
			}, function(result, err) {
			  if(err) {
			    throw new Error('There has been an error! in /layer/subscribe/ '+err);
			  } else {
				    console.log("USER SUBCSCRIBED RESPONSE");
				    console.log(result);
			  	}
			});
	  	}//close else function in create layer
	});// close create layer geoloqi call
	}//close createLayer function
  }	//close AddNewUser function
} // main addUser function

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
	console.log("moving on to updating their info with geoloqi");
	console.log("length of the array is " + newMsg.users.length);
	// now lets update the layers of all users involved in the message
	// this is a 3-step process:
	// 1. Create the Place and save that in the userschema
	// 2. Create the Trigger and save that in the userscema
	// 3. Update the userschema with this new data
	for(var i = 0; i < newMsg.users.length; i++) {
		// loop through each userID in the array, and update their layer with the new message
		var currentUserID = newMsg.users[i];
		console.log("the current user in the array is " + currentUserID);
		var userQuery = models.User.findOne({geoloqiUserID:currentUserID});
		userQuery.exec(function(err, currentUser){

			if (err) {
				return res.status(500).send("There was an error on this user query");
			}

			//if the currentUser exists, update their layer
			if (currentUser) {
				console.log("updating layer for user " + currentUser.name);
				console.log("the layer that we are adding the place is " + currentUser.layerID);
				//create the place in geoloqi; the place maps to the message
				session.post('/place/create', {
			  	  "Authorization": "OAuth " + currentUser.geoloqiTOKEN,
				  "layer_id": currentUser.layerID,
				  "radius": 9999,
				  "latitude": newMsg.lat,
				  "longitude": newMsg.lon
				}, function(result, err) {
				  if(err) {
				    throw new Error('There has been an error! '+err);
				  } else {
				  		console.log("!!!! HERE IS THE PLACE RESPONSE!!!");
				  		console.log(result);
				  		// now that we have the placeID, let's add the trigger.. function for getting the triggerID goes next
						session.post('/trigger/create', {
			  	  		  "Authorization": "OAuth " + currentUser.geoloqiTOKEN,
						  "place_id": result.place_id,
						  "type": "callback",
						  "url": "http://geonotes.herokuapp.com/getCallback",
						  "text": newMsg.content
						}, function(result, err) {
						  if(err) {
						    throw new Error('There has been an error! '+err);
						  } else {
							    // we have the triggerID
						  		console.log("!!!! HERE IS THE TRIGGER RESPONSE!!!");
						  		console.log(result);
						  		// put the data in the place schema associated with that user
							    var placeData = {
							    	placeID: result.place_id,
							    	messageID: newMsg._id,
							    	content: newMsg.content,
							    	lat: newMsg.lat,
							    	lon: newMsg.lon,
							    	trigger: result.trigger_id,
							    }
								models.User.update({_id:currentUser._id}, {$push: { messages : placeData }},{upsert:true}, function(err, user){
									if (err) {
										console.error("ERROR: While adding updating place/message");
										console.error(err);			
									}
								}) 
						  	} //ends the else stament in the trigger/create function
						});//ends the trigger/create function 
				  	}//ends the else statement in the place/create geoloqi function
				});//ends the the place/create/ geoloqi function
			}// ends the currentUser if statement, which handles updating all users in the array
		
			// else, they are not in the system
			else {
				console.log("no user found");
			}

		});//ends the userQuery function that is updating the user
  } // ends the for loop iterating through all the users
} // ends the addMsg function

exports.getCallback = function(req, res) {
	console.log("callback from geoloqi!");
	console.log(req.body);
}

exports.triggerUpdate= function(req, res) {
	session.post('/location/update', {
  	  "Authorization": "OAuth b7f86-a8460971d19899da25790cc1e1e18096f43d52c9",
	  "location": [
		  {
		    "raw": {
		      "distance_filter": 30,
		      "battery_state": "charging",
		      "hop_distance": 30,
		      "profile": "adaptive",
		      "tracking_limit": 900,
		      "power_source": "usb",
		      "battery": 26
		    },
		    "date": "2013-04-29T16:48:15-0400",
		    "location": {
		      "type": "point",
		      "source": "network",
		      "position": {
		        "longitude": -73.9924142,
		        "horizontal_accuracy": 563,
		        "latitude": 40.7304433,
		        "speed": 0,
		        "altitude": 0
		      }
		    }
		  }
		]
	}, function(result, err) {
	  if(err) {
	    throw new Error('There has been an error! '+err);
	  } else {
		    // we have the triggerID
	  		console.log("!!!! HERE IS THE TRIGGER RESPONSE!!!");
	  		console.log(result);
	  		// put the data in the place schema associated with that user
		    var placeData = {
		    	placeID: result.place_id,
		    	messageID: newMsg._id,
		    	content: newMsg.content,
		    	lat: newMsg.lat,
		    	lon: newMsg.lon,
		    	trigger: result.trigger_id,
		    }
			models.User.update({_id:currentUser._id}, {$push: { messages : placeData }},{upsert:true}, function(err, user){
				if (err) {
					console.error("ERROR: While adding updating place/message");
					console.error(err);			
				}
			}) 
	  	} //ends the else stament in the trigger/create function
	});//ends the trigger/create function 
}