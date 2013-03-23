
/**
 * Module dependencies.
 */

var express = require('express')
  , cons = require('consolidate')
  , swig = require('swig')
  , routes = require('./routes') 
  , auth = require('./routes/auth')
  , user = require('./routes/user')
  , user = require('./routes/event')
  , http = require('http')
  , path = require('path')
  , request = require('request');

var app = express();

//
// CONFIG
//

swig.init({ root: __dirname + '/views', allowErrors: true });

app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.engine('html', cons.swig);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('coldhands'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  //app.use(express.csrf());
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//
// Security Middleware (must go before Routes)
//

function requireLogin(req, res, next) {
  auth.status(req, res);
  if (req.session.email == "asaeed@gmail.com") {
    next();
  } else {
    res.redirect("/");
  }
}

app.all("/users", requireLogin, function(req, res, next) {next();});
app.all("/users/*", requireLogin, function(req, res, next) {next();});
app.all("/events", requireLogin, function(req, res, next) {next();});
app.all("/events/*", requireLogin, function(req, res, next) {next();});

//
// ROUTES
//

app.get('/', routes.index);

app.post('/auth/status', auth.status);
app.get('/auth/logout', auth.logout);

app.get('/users', user.findAll);
app.get('/users/:id', user.findById);
app.post('/users', user.addItem);
app.put('/users/:id', user.updateItem);
app.delete('/users/:id', user.deleteItem);

app.get('/events', user.findAll);
app.get('/events/:id', user.findById);
app.post('/events', user.addItem);
app.put('/events/:id', user.updateItem);
app.delete('/events/:id', user.deleteItem);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Server listening on port " + app.get('port'));
});
