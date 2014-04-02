
var db = require('mongojs').connect("eventdb",["event","users","chapters"]);

exports.validateUser = function(user, callback){
	db.users.find({name:user.name,password:user.password},function(error,doc){
		if(typeof doc[0] === 'undefined'){ 
				console.log('validateUser() : Could not login');
				callback(false);
				return;
				}
		var flag = false;
		if(!error)
		{	
			//console.log(doc[0]);
			//console.log(user);
			if(doc[0].name == user.name && doc[0].password == user.password)
				{flag = true; }
		}
		else flag = false;
		callback(flag);
	});
}

exports.createUser = function(details,callback){
	details.events = [];
	db.users.insert(details,function(error,status){
		if(!error && status)
			callback(true);
		else callback(false);
	});
}

exports.getUser = function(username, callback){
	db.users.find({name:username}, function(error, doc){
		callback(doc);
	});
}

exports.hasJoinedEvent = function(username,eventid,callback)
{
	db.users.find({name : username, events : eventid}, function(error,doc){
		console.log(error);
		console.log(doc);
	});
}

exports.joinEvent = function(username,eventid,callback){
	db.users.find({name:username}, function(error,doc){
		if(!error && doc)
		{
			var ev = doc[0].events;
			if(typeof ev === 'undefined')
				ev = [];
			ev.push(eventid);
			db.users.update({name:username},{$set : {events : ev}}, function(error,status){
					if(error || !status)
						{
							console.log("joinEvent() : error -> " + error);
							callback(false);
						}
					else {
							console.log("joinEvent() : user joined event");
							callback(true);
						}		
				});
		}
		else callback(true);
	});
}
