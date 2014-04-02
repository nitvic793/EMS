
 
var md5 = require('MD5');
var events = require('../controllers/events');
var users = require('../controllers/users');
var chapters = require('../controllers/chapters');
var multiparty = require('multiparty');

exports.index = function(req, res){
	//console.log(req.session);
	events.getEvents(function(data)
	{
	   e = []; k= 0;
		for(i=data.length-1;i>=data.length-6;--i)
		{	
			if(data[i])
				e[k] = data[i];
			else break;
			k++;	
		}
		res.render('index', { title: 'EMS' , details : e, session : req.session});
		//console.log(e);
		data.forEach(function(entry){
			//	console.log(entry._id);
				
		});
	});
  
};

exports.addEventForm = function(req,res){
	chapters.getChapters(function(doc){
		if(!doc)
			console.log('addEventForm() : Could not retrieve chapters');
		else 
		{
			//console.log('doc');
			res.render('event',{chapters:doc, session : req.session});
		}
	});
}

exports.helloworld = function(req, res){
    var event = {name : "ABCD", venue : "TT"};
	res.render('hello', { title: 'Testing' , authors : ['CCC','SDSD','Test']});
}

exports.addEvent = function(req,res){
	//console.log(req.body.date);
	var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
	   console.log(files);		
	  fields.logo = files.logofile[0].originalFilename;
	  fields.eventid = md5(fields.ename+fields.date);
	  events.createEvent(fields,function(error,status){
		if(!error && status)
			console.log('addEvent(): Inserted succesfully.');
		else console.log('addEvent(): Error : ' + error);
	  });
	  res.redirect('/');
	 // res.render('show',{ename : fields.ename + fields.eventid});
	 // console.log(fields);
	  //console.log(files.logofile);
	  
	  //copy logofile to '/uploads/' dir
	  
	});
	/*events.createEvent(req.body,function(error,status){
		if(!error && status)
			console.log('Inserted succesfully.');
		else console.log('Error : ' + error);
	});
	res.render('show',{ename : req.body});*/
}

exports.show = function(req,res)
{
   res.render('show',{email : req.body.email});
}

exports.getEvent = function(req,res)
{	
	var id = req.params.id;
	events.getEvent(id, function(doc){
		console.log("routes.index.getEvent(): " + id + doc[0]);
		res.render('show',{event : doc[0], session : req.session});
	});
}

exports.loginForm = function(req,res){
	if(req.session.logged)
	{
		res.render("message", {message : "You are already logged in " + req.session.user, session : req.session});
	}
	else
	res.render('login');
}

exports.login = function(req,res)
{
	//console.log(req.body);
	if(req.session.logged)
	{
		res.render("message", {message : "You are already logged in " + req.session.user, session : req.session});
	}
	else 
	users.validateUser(req.body,function(isValidated){
		console.log('login() : ' + isValidated);
		if(isValidated)
		{
			req.session.logged = true;
			req.session.user = req.body.name;
			res.render('message',{message:'Log in success!', session : req.session});
		}
		else {req.session.logged = false;
		res.render('message',{message:'Log in failed!', session : req.session});}
	});
}

exports.logout = function(req,res){
	req.session.destroy(function()
	{
		res.render('message',{message:'Logged Out'});
	});
}

exports.registerForm = function(req,res){
	res.render('register');
};

exports.register = function(req,res){
	users.createUser(req.body,function(status){
		var msg;
		if(status)
			msg = "Registration Done!";
		else msg = "Error in Registration!";
		res.render('message',{message : msg, session : req.session});
	});
}

exports.chapterForm = function(req,res){
	res.render('chapterform', {session : req.session});
}

exports.chapterRegister = function(req,res)
{
	chapters.createChapter(req.body,function(status){
		var msg;
		if(status)
			msg = "Chapter/Club Added";
		else msg = "Error in Registration!";
		res.render('message',{message : msg, session : req.session});
			
	});
}

exports.chapterList = function(req,res)
{
	chapters.getChapters(function(doc){
		if(doc)
			res.render('chapterlist',{chapters : doc, session : req.session});
		else res.render('message',{message:"Error", session : req.session});
	});
}

exports.eventList = function(req,res)
{
	events.getEvents(function(doc){
		if(doc)
			res.render('eventlist',{events : doc, session : req.session});
		else res.render('message',{message:'Error', session : req.session});
	});
}

exports.joinEvent = function(req,res)
{
	if(!req.session.logged)
	{
		res.render("message",{message : "Error : You are not logged in", session : req.session});
	}
	else
	{
		var eventid = req.params.id;
		var uname = req.session.user;
		users.hasJoinedEvent(eventid,uname,function(){});
		users.joinEvent(uname,eventid,function(done){
				if(done)
				{
					res.render("message",{message : "User joined event", session : req.session});
				}
				else
				{
					res.render("message", {message : "Error : Could not join event" , session : req.session});
				}
		});
	}
}