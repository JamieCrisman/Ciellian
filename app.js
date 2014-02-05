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
	mongoose = require("mongoose");//,
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
	explanation: "", 
	root: ["aku"], 
	synonym: [], 
	antonym: [], 
	counterpart: [],
	category: "noun",
	relatedTerms: ["aku", "nakunu", "nokunu"]
}).save();

var one = new Word({
	name: "aku", 
	meaning: ["true", "one"], 
	explanation: "true or the number 1",
	root: [], 
	synonym: [], 
	antonym: ["aku"], 
	counterpart: [],
	category: "number",
	relatedTerms: ["kunu", "oku"]
}).save();
var zero = new Word({
	name: "oku", 
	meaning: ["false", "zero"], 
	explanation: "zero or the number 0",
	root: [], 
	synonym: [], 
	antonym: ["aku"], 
	counterpart: [],
	category: "number",
	relatedTerms: ["kunu", "aku"]
}).save();

var light = new Word({
	name: "chii", 
	meaning: ["light"], 
	explanation: "stimulates sight to make things visable.",
	root: [], 
	synonym: [], 
	antonym: ["chizoe"], 
	counterpart: [],
	category: "noun",
	relatedTerms: ["chimezo"]
}).save();

var contain = new Word({
	name: "zoe", 
	meaning: ["contain", "own"], 
	explanation: "to contain or have ownership",
	root: [], 
	synonym: [], 
	antonym: [], 
	counterpart: [],
	category: "verb",
	relatedTerms: []
}).save();

var lack = new Word({
	name: "mezoe", 
	meaning: ["lack"], 
	explanation: "state without ownership. Doesn't have enough of something",
	root: ["zoe"], 
	synonym: [], 
	antonym: ["mizoe"], 
	counterpart: [],
	category: "noun",
	relatedTerms: ["zoe", "mizoe"]
}).save();

var abundance = new Word({
	name: "mizoe", 
	meaning: ["abundance"], 
	explanation: "state of plentiful ownership.",
	root: ["zoe"], 
	synonym: [], 
	antonym: ["mezoe"], 
	counterpart: [],
	category: "noun",
	relatedTerms: ["mezoe", "zoe"]
}).save();

var darkness = new Word({
	name: "mezochi", 
	meaning: ["darkness"], 
	explanation: "lack of light.",
	root: ["mezoe", "chii"], 
	synonym: [], 
	antonym: ["chii"], 
	counterpart: [],
	category: "noun",
	relatedTerms: ["chii"]
}).save();

var complete = new Word({
	name: "paze", 
	meaning: ["complete"], 
	explanation: "absolute; total; greatest degree.",
	root: [], 
	synonym: [], 
	antonym: ["opaze"], 
	counterpart: [],
	category: "adjective",
	relatedTerms: ["opaze"]
}).save();

var incomplete = new Word({
	name: "opaze", 
	meaning: ["incomplete"], 
	explanation: "not complete",
	root: ["paze"], 
	synonym: [], 
	antonym: ["paze"], 
	counterpart: [],
	category: "adjective",
	relatedTerms: ["paze"]
}).save();

var unknown = new Word({
	name: "shiro", 
	meaning: ["unknown", "variable"], 
	explanation: "an unknown entity; a variable",
	root: [], 
	synonym: [], 
	antonym: [], 
	counterpart: [],
	category: "noun",
	relatedTerms: []
}).save();

var see = new Word({
	name: "gai", 
	meaning: ["see"], 
	explanation: "(to) see",
	root: [], 
	synonym: [], 
	antonym: [], 
	counterpart: [],
	category: "action",
	relatedTerms: []
}).save();

var method = new Word({
	name: "zio", 
	meaning: ["way", "method"], 
	explanation: "how something is done. which direction.",
	root: [], 
	synonym: [], 
	antonym: [], 
	counterpart: [],
	category: "noun",
	relatedTerms: []
}).save();

var perspective = new Word({
	name: "gaizo", 
	meaning: ["perspective", "point of view"], 
	explanation: "a way of seeing; perspective",
	root: ["gai", "zio"], 
	synonym: [], 
	antonym: [], 
	counterpart: [],
	category: "noun",
	relatedTerms: ["gai", "zio"]
}).save();

var certain = new Word({
	name: "mashira", 
	meaning: ["certain", "specific"], 
	explanation: "completely known. a known set",
	root: ["shiro"], 
	synonym: [], 
	antonym: [], 
	counterpart: [],
	category: "adjective",
	relatedTerms: ["shiro"]
}).save();

/*
// for testing some amount of test words
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

