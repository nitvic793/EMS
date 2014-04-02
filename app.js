
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var swig = require('swig');
var app = express();


app.engine('html', swig.renderFile);
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('controller', path.join(__dirname,'controller'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// all environments


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/',routes.index);
/*/app.get('/users', user.list);*/
app.get('/hello',routes.helloworld);
app.post('/show',routes.show);
app.get('/eventform',routes.addEventForm);
app.post('/event/add',routes.addEvent);
app.get('/event/:id',routes.getEvent);
app.get('/event/show/list',routes.eventList);
app.get('/login',routes.loginForm);
app.post('/user/login',routes.login);
app.get('/user/logout',routes.logout);
app.post('/user/register',routes.register);
app.get('/chapterform',routes.chapterForm);
app.post('/chapter/register',routes.chapterRegister);
app.get('/chapter/list', routes.chapterList);
app.get('/register',routes.registerForm);
app.get('/user/join/:id',routes.joinEvent);

//Redirects
app.get('/event/css/:par',function(req,res){res.redirect('/css/'+req.params.par);});
app.get('/event/js/:par',function(req,res){res.redirect('/js/vendor/'+req.params.par);});
app.get('/chapter/list/css/:par',function(req,res){res.redirect('/css/'+req.params.par);});
app.get('/chapter/list/js/:par',function(req,res){res.redirect('/js/vendor/'+req.params.par);});
app.get('/event/show/list/css/:par',function(req,res){res.redirect('/css/'+req.params.par);});
app.get('/event/show/list/js/:par',function(req,res){res.redirect('/js/vendor/'+req.params.par);});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
