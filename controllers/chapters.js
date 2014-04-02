var db = require('mongojs').connect("eventdb",["event","users","chapters"]);

exports.createChapter = function(details,callback)
{
	db.chapters.insert(details,function(error,status){
		if(!error && status)
			callback(true);
		else callback(false);
	});
}

exports.getChapter = function(ccode,callback)
{
	db.chapters.find({"code":ccode},function(error,doc){
		if(!error)
		callback(doc);
		else callback(false);
	});
}

exports.getChapters = function(callback)
{
	db.chapters.find({},function(error,doc){
		if(!error)
		callback(doc);
		else callback(false);
	});
}