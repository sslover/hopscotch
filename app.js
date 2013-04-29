
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');


// the ExpressJS App
var app = express();

// configuration of port, templates (/views), static files (/public)
// and other expressjs settings for the web server.
app.configure(function(){

  // server port number
  app.set('port', process.env.PORT || 5000);

  //  templates directory to 'views'
  app.set('views', __dirname + '/views');

  // setup template engine - we're using Hogan-Express
  app.set('view engine', 'html');
  app.set('layout','layout');
  app.engine('html', require('hogan-express')); // https://github.com/vol4ok/hogan-express

  app.use(express.favicon());
  // app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  // database - skipping until week 5
  app.db = mongoose.connect(process.env.MONGOLAB_URI);
  console.log("connected to database");
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/* 
SKIPPING FOR FUTURE CLASSES
SESSIONS w/ MongoDB (store sessions across multiple dynos)
COOKIEHASH in your .env file (also share with heroku) 
*/
// app.use(express.cookieParser(process.env.COOKIEHASH));
// app.use(express.session({ 
//     store: new mongoStore({url:process.env.MONGOLAB_URI, maxAge: 300000})
//     , secret: process.env.COOKIEHASH
//   })
// );

// ROUTES

var routes = require('./routes/index.js');

app.get('/', routes.triggerUpdate);

// API methods to get all information on users, messages, and groups, and return in JSON
app.get('/allUserData', routes.returnAllUserData);
app.get('/allMsgData', routes.returnAllMsgData);
app.get('/allGrpData', routes.returnAllGrpData);

// API methods to get information for specific users, messages, and groups
app.get('/user/:user_id', routes.returnUserData);
app.get('/msg/:msg_id', routes.returnMsgData);
app.get('/grp/:grp_id', routes.returnGrpData);

// API methods to receive HTTP Posts, add to database, and respond with needed information in JSON
app.post('/addUser',routes.addUser);
app.post('/addGroup',routes.addGroup);
app.post('/addMsg',routes.addMsg);

app.post('/getCallback', routes.getCallback);


// in case we need to respond to posts for specific data
//app.post('/getUser',routes.getUser);
//app.post('/getGroup',routes.getGroup);
//app.post('/getMsg',routes.getMsg);

// create NodeJS HTTP server using 'app'
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});