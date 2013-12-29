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

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};




var restify = require("restify"),
	userSave = require("save")('user'),
	mongoose = require("mongoose");//,
	//hash = require('./pass').hash;
var fs = require('fs');
eval(fs.readFileSync('pass.js')+''); //including the pass.js which includes the edit password. super hackish

var url = require('url');
var server = restify.createServer({name: "Lexicon"});
server.use(restify.fullResponse());
// Add headers

server.use(function (req, res, next) {

    // website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
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
	explanation: String,
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
	explanation: "root of meet. meaning to interact with another person.", 
	root: [], 
	synonym: [], 
	antonym: [], 
	counterpart: [],
	category: "root",
	relatedTerms: ["opa", "apa"]
}).save();
var hello = new Word({
	name: "apa", 
	meaning: ["Hello"], 
	explanation: "Greeting", 
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
	explanation: "Farewell", 
	root: ["pa"], 
	synonym: [], 
	antonym: ["apa"], 
	counterpart: [],
	category: "exclamation",
	relatedTerms: ["apa"]
}).save();

var consistant = new Word({
	name: "nakunu", 
	meaning: ["Consistant", "Accurate"], 
	explanation: "Agreement of truthful ideas", 
	root: ["kunu"], 
	synonym: [], 
	antonym: ["nokunu"], 
	counterpart: [],
	category: "adjective",
	relatedTerms: ["nokunu"]
}).save();

var contradiction = new Word({
	name: "nokunu", 
	meaning: ["Contradiction", "Inconsistent", "Inaccurate"], 
	explanation: "Disagreement of truthful ideas", 
	root: ["kunu"], 
	synonym: [], 
	antonym: ["nakunu"], 
	counterpart: [],
	category: "adjective",
	relatedTerms: ["nakunu"]
}).save();

var truth = new Word({
	name: "kunu", 
	meaning: ["truth"], 
	explanation: "root meaning truth.", 
	root: [], 
	synonym: [], 
	antonym: [], 
	counterpart: [],
	category: "root",
	relatedTerms: ["nakunu", "nokunu"]
}).save();

/*
for(var xx = 0; xx < 500; xx++){
	var bye = new Word({
		name: "opa" + xx, 
		meaning: ["Goodbye" + xx], 
		explanation: "Farewell" + xx, 
		root: ["pa" + xx], 
		synonym: [], 
		antonym: ["apa" + xx], 
		counterpart: [],
		category: "exclamation",
		relatedTerms: ["apa" + xx]
	}).save();
}
*/

var WORD_LIMIT = 1024;

//server functions
server.listen(3000, function(){
	console.log('%s is listening at %s', server.name, server.url);
});

server.get('/word/', function(req, res, next){
	Word.count({}, function(error, totalCount){
		if(error){
			return next( new restify.InvalidArgumentError( JSON.stringify(error.errors) ) );
		}
		if(totalCount){
			console.log("Sending Limit and Current Total Word Count");
			var ret = {
				"total": totalCount,
				"limit": WORD_LIMIT
			};
			res.send(ret);
		}else{
			res.send(404);
		}
	});
});

server.get("/getwords/", function(req, res, next){
	params = url.parse(req.url, true).query
	//var offset = ((!blank(params.page))? (params.page * WORD_LIMIT) : 0); // if we have a page set the offset
	var offset = 0;
	Word.find({}, {'_id': 0, '__v': 0}, {skip: offset, limit: WORD_LIMIT}, function(error, word){
		if(error){
			return next( new restify.InvalidArgumentError( JSON.stringify(error.errors) ) );
		}
		if(word){
			console.log("Sending words: " + offset + " - " + (offset+WORD_LIMIT - 1 ));
			var ret = {
				"words": word,
				"count": word.length
			};
			res.send(ret);
		}else{
			res.send(404);
		}
	});
});

server.get('/word/:word', function(req, res, next){
	Word.find({name: req.params.word.toLowerCase()}, {'_id': 0, '__v': 0}, function(error, word){
		if(error){
			return next( new restify.InvalidArgumentError( JSON.stringify(error.errors) ) );
		}
		if(word[0]){
			console.log("Sending: '" + word[0]["name"] + "' which means " + word[0].meaning);
			res.send(word[0]);
		}else{
			return next(new restify.InvalidArgumentError("Unable to find: " + req.params.word));
		}
	});
});

//update Function
server.post('/word/:word', function(req, res, next){
	//find word
	//update stuff
	//send update resp

	var wordErrors = "";
	if(blank(req.params.name)){
		wordErrors += " word name cannot be blank; ";
	}
	if(!blank(wordErrors)){
		return next(new restify.InvalidArgumentError(wordErrors));
	}
	
	Word.find({name: req.params.name.toLowerCase()}, function(error, word){
		if(!blank(word[0])){
			var w = word[0]; //should only be the first word
			w.meaning = (blank(req.params.meaning))? w.meaning : req.params.meaning;
			w.explanation  = (blank(req.params.explanation))? w.explanation : req.params.explanation;
			w.root  = (blank(req.params.root))? w.root : req.params.root;
			w.synonym  = (blank(req.params.synonym))? w.synonym : req.params.synonym;
			w.antonym  = (blank(req.params.antonym))? w.antonym : req.params.antonym;
			w.counterpart  = (blank(req.params.counterpart))? w.counterpart : req.params.counterpart;
			w.category  = (blank(req.params.category))? w.category : req.params.category;
			w.relatedTerms  = (blank(req.params.relatedTerms))? w.relatedTerms : req.params.relatedTerms;
			w.save();
			console.log("Updated word: ");
			console.log(w);
			res.send(w);	
		}else{
			return next(new restify.InvalidArgumentError("Couldn't find the word? Did you mean to create a new one?"));
		}
	});
	
});

server.post('/wordnew', function(req, res, next){
	var wordErrors = "";
	var newWord = req.params.word;
	if(!validPass(req.params.pass)){
		wordErrors += "Bad Key";
	}

	if(blank(newWord.name)){
		wordErrors += " asdf word name cannot be blank; ";
	}
	if(blank(newWord.meaning)){
		wordErrors += " word needs a meaning; ";
	}
	if(!blank(wordErrors)){
		return next(new restify.InvalidArgumentError(wordErrors));
	}
	
	Word.find({name: newWord.name.toLowerCase()}, function(error, word){
		var shinword;
		if(blank(word)){
			shinword = new Word({
				name: newWord.name, 
				meaning: newWord.meaning, 
				explanation: ((blank(newWord.explanation))? "" : newWord.explanation), 
				root: ((blank(newWord.root))? [] : newWord.root), 
				synonym: ((blank(newWord.synonym))? [] : newWord.synonym), 
				antonym: ((blank(newWord.antonym))? [] : newWord.antonym), 
				counterpart: ((blank(newWord.counterpart))? [] : newWord.counterpart),
				category: ((blank(newWord.category))? "" : newWord.category),
				relatedTerms: ((blank(newWord.relatedTerms))? [] : newWord.relatedTerms)
			});
		}else{
			shinword = word[0];
			shinword.meaning = newWord.meaning;
			shinword.explanation = ((blank(newWord.explanation))? "" : newWord.explanation);
			shinword.root = ((blank(newWord.root))? [] : newWord.root);
			shinword.synonym = ((blank(newWord.synonym))? [] : newWord.synonym); 
			shinword.antonym = ((blank(newWord.antonym))? [] : newWord.antonym);
			shinword.counterpart = ((blank(newWord.counterpart))? [] : newWord.counterpart);
			shinword.category = ((blank(newWord.category))? "" : newWord.category);
			shinword.relatedTerms = ((blank(newWord.relatedTerms))? [] : newWord.relatedTerms)
		}
		shinword.save();
		console.log("Created word: ");
		console.log(shinword);
		res.send(shinword);
	});
	
});

server.del('/word/:word', function(req, res, next){
	if(validPass(req.params.pass)){
		Word.remove({name: req.params.word.toLowerCase()}, function(error, word){
			if(error){
				return next( new restify.InvalidArgumentError( JSON.stringify(error.errors) ) );
			}
			console.log(word);
			res.send();
		});
	}else{
		return next(new restify.InvalidArgumentError("Invalid Delete Code;"));
	}
	
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
