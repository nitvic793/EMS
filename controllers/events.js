var db = require('mongojs').connect("eventdb",["event","users","chapters"]);

function createEvent(event,callback)
{
  return db.event.insert(event,function(error,status){
			callback(error,status);
  });
} 


function getEvents(callback)
{
    var ev = "";
	var c = db.event.find({},function(error,doc){
		ev = doc;
		if(!error) 
			{
				console.log('getEvents() : Got all data!');
				callback(doc);
			}
		else 
			{
				console.log('getEvents() : Error : ' + error);
				callback(false);
			}
		
	});
	return ev;
	
}

function getEvent(id,callback)
{
	console.log("events.getEvent(): ID-" + id);
	db.event.find({eventid : id}, function(error,doc){
		console.log(doc.ename);
		callback(doc);
	});
}

exports.createEvent = createEvent;
exports.getEvents = getEvents;
exports.getEvent = getEvent;