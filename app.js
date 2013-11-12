function blank(obj) { 
    var cache;

    if((cache = typeof obj) !== 'boolean' && (cache !== 'number' || isNaN(obj)) && !obj)
        return true;
    if(cache == 'string' && obj.replace(/\s/g, '').length === 0)
        return true;
    if(cache == 'object') {
        if((cache = toString.call(obj)) == '[object Array]' && obj.length === 0)
            return true;
        if(cache == '[object Object]') {
            for(cache in obj) {
                return false;
            }
            return true;
        }
    }

    return false;
}



var restify = require("restify"),
	userSave = require("save")('user'),
	mongoose = require("mongoose");//,
	//hash = require('./pass').hash;

var server = restify.createServer({name: "Lexicon"});

server.use(restify.fullResponse());
server.use(restify.bodyParser());

restify.defaultResponseHeaders =function(data){
	this.contentType = 'json';
}


//seed
//userSave.create({name: 'AwkwardHero'});

//mongo setup
mongoose.connect("mongodb://localhost/myapp");

var WordSchema = new mongoose.Schema({
	name: String,
	meaning: Array,
	explaination: String,
	root: Array,
	synonym: Array,
	antonym: Array,
	counterpart: Array,
	category: String,
	relatedTerms: Array
});

var Word = mongoose.model('word', WordSchema);

Word.collection.drop(null); // clear out all words for now
var meet = new Word({
	name: "pa", 
	meaning: ["meet"], 
	explaination: "root of meet. meaning to interact with another person.", 
	root: [], 
	synonym: [], 
	antonym: [], 
	counterpart: [],
	category: "root",
	relatedTerms: ["opa", "opa"]
}).save();
var hello = new Word({
	name: "apa", 
	meaning: ["Hello"], 
	explaination: "Greeting", 
	root: ["pa"], 
	synonym: [], 
	antonym: ["opa"], 
	counterpart: [],
	category: "exclamation",
	relatedTerms: ["opa"]
}).save();
var bye = new Word({
	name: "opa", 
	meaning: ["Goodbye"], 
	explaination: "Farewell", 
	root: ["pa"], 
	synonym: [], 
	antonym: ["apa"], 
	counterpart: [],
	category: "exclamation",
	relatedTerms: ["apa"]
}).save();


//server functions
server.listen(3000, function(){
	console.log('%s is listening at %s', server.name, server.url);
});

server.get('/word/:word', function(req, res, next){
	Word.find({name: req.params.word.toLowerCase()}, {'_id': 0, '__v': 0}, function(error, word){
		if(error){
			return next( new restify.InvalidArgumentError( JSON.stringify(error.errors) ) );
		}
		if(word){
			console.log("Sending: '" + word[0]["name"] + "' which means " + word[0].meaning);
			res.send(word[0]);
		}else{
			res.send(404);
		}
	});
});

//update Function
server.post('/word/:word', function(req, res, next){

	//TODO

	//find word
	//update stuff
	//send update resp

	var wordErrors = [];
	if(blank(req.params.name)){
		wordErrors += " word name cannot be blank; ";
	}
	if(blank(req.params.meaning)){
		wordErrors += " word needs a meaning; ";
	}
	if(!blank(wordErrors)){
		return next(new restify.InvalidArgumentError(wordErrors));
	}
	
	Word.find({name: req.params.name.toLowerCase()}, function(error, word){
		if(!blank(word)){
			return next(new restify.InvalidArgumentError("Word Already Exists; Please Use Update"));
		}else{
			var shinword = new Word({
				name: req.params.name, 
				meaning: req.params.meaning, 
				explaination: ((blank(req.params.explaination))? "" : req.params.explaination), 
				root: ((blank(req.params.root))? [] : req.params.root), 
				synonym: ((blank(req.params.synonym))? [] : req.params.synonym), 
				antonym: ((blank(req.params.antonym))? [] : req.params.antonym), 
				counterpart: ((blank(req.params.counterpart))? [] : req.params.counterpart),
				category: ((blank(req.params.category))? "" : req.params.category),
				relatedTerms: ((blank(req.params.relatedTerms))? [] : req.params.relatedTerms)
			});
			shinword.save();
			console.log("Created word: ");
			console.log(shinword);
			res.send(shinword);	
		}
	});
	
});


server.get('/word/', function(req, res, next){
	Word.find({}, {'_id': 0, '__v': 0}, function(error, word){
		if(error){
			return next( new restify.InvalidArgumentError( JSON.stringify(error.errors) ) );
		}
		if(word){
			
			//console.log(word[0]["_id"]);
			console.log("Sending all words");
			res.send(word);
		}else{
			res.send(404);
		}
	});
});

server.post('/word/new', function(req, res, next){
	var wordErrors = [];
	if(blank(req.params.name)){
		wordErrors += " word name cannot be blank; ";
	}
	if(blank(req.params.meaning)){
		wordErrors += " word needs a meaning; ";
	}
	if(!blank(wordErrors)){
		return next(new restify.InvalidArgumentError(wordErrors));
	}
	
	Word.find({name: req.params.name.toLowerCase()}, function(error, word){
		if(!blank(word)){
			return next(new restify.InvalidArgumentError("Word Already Exists; Please Use Update"));
		}else{
			var shinword = new Word({
				name: req.params.name, 
				meaning: req.params.meaning, 
				explaination: ((blank(req.params.explaination))? "" : req.params.explaination), 
				root: ((blank(req.params.root))? [] : req.params.root), 
				synonym: ((blank(req.params.synonym))? [] : req.params.synonym), 
				antonym: ((blank(req.params.antonym))? [] : req.params.antonym), 
				counterpart: ((blank(req.params.counterpart))? [] : req.params.counterpart),
				category: ((blank(req.params.category))? "" : req.params.category),
				relatedTerms: ((blank(req.params.relatedTerms))? [] : req.params.relatedTerms)
			});
			shinword.save();
			console.log("Created word: ");
			console.log(shinword);
			res.send(shinword);	
		}
	});
	
});


/*
server.post('/login', function(req,res,next){
	if(req.params.username === undefined || req.params.username == "" && req.params.username == req.params.username.replace(/\W/g, '')){
		return next(new restify.InvalidArgumentError('Invalid Username'));
	}
	authenticate(req.params.username.toLowerCase(), req.params.password, function(error, user){
		if(error){
			return next( new restify.InvalidArgumentError( "Invalid User Or Pass" ) );
		}
		res.send(201,{token: user.token, message: "Login successful"});
	});
});

server.post('/user', function(req, res, next){
	if(req.params.password != req.params.confirmPassword){
		return next(new restify.InvalidArgumentError( "Passwords did not match" ) );
	}
	if(req.params.username === undefined || req.params.username == "" && req.params.username == req.params.username.replace(/\W/g, '')){
		return next(new restify.InvalidArgumentError('Invalid Username'));
	}
	User.find({username: req.params.username.toLowerCase()}, function(err, user){
		//console.log("users found____________");
		//console.log(user);
		if(user.length > 0){
			//console.log("username taken");
			return next(new restify.InvalidArgumentError('Username Taken'));
		}else{
			hash(req.params.password, function(err, salt, hash){
				if(err) return next( new restify.InvalidArgumentError( "Error: "+JSON.stringify(err.errors) ) );
				User.create({
					username: req.params.username.toLowerCase(),
					password: hash,
						salt: salt,
					   token: req.params.username.toLowerCase() + "-" + (hash+"").substring(Math.floor(hash.length/8), Math.ceil(hash.length/0.25))
				}, function(error, user){
					if (error){
						return next( new restify.InvalidArgumentError( "Error: "+JSON.stringify(error.errors) ) );
					};
					//console.log(user);
					res.send(201,{token: user.token, message: "User created"});
				});
			});
		}
	});
});

server.post('/testToken', function(req,res,next){
	if(req.params.token === undefined || req.params.token == null){
		res.send({isValid: false, message: "Please Insert 1 Token(s)"});
	}

	var who = req.params.token.split("-")[0];
	//console.log(who);
	//console.log(req.params.token);
	User.findOne({username: who.toLowerCase(), token: req.params.token}, function(error, user){
		//console.log(error);
		if(user != null)
			res.send({isValid: true});
		else
			res.send({isValid: false, message: "Invalid Token"});
	});
});

server.del('/user/:username', function(req, res, next){
	//this is totally safe</sarcasm>
	if(req.params.secret == "BOSSKEY25"){
		User.remove({username: req.params.username.toLowerCase()}, function(error, user){
			if(error){
				return next( new restify.InvalidArgumentError( JSON.stringify(error.errors) ) );
			}
			res.send();
		});
	}else{
		res.send();
	}
	
});


//helper functions

function authenticate(name, pass, fn){
	if(!module.parent) console.log("Authenticating: %s:%s", name, pass);

	User.findOne({username: name}, function(err, user){
		if(user){
			if(err){
				return fn( new restify.InvalidArgumentError( JSON.stringify(err.errors) ) );
			}
			hash(pass, user.salt, function(err, hash){
				if(err) return fn( new restify.InvalidArgumentError( JSON.stringify(err.errors) ) );
				if(hash == user.password) return fn(null, user);
				return fn( new restify.InvalidArgumentError( "Invalid User or Pass" ) );
			});
		}else{
			return fn( new restify.InvalidArgumentError( "Invalid User or Pass" ) );
		}
	});
}

*/
