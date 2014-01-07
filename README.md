# MBL

The master branch has all the lexicon api. gh-pages has the language documentation.

The project requires restify and mongoose.

You also need to create a file called `pass.js` in the same folder as app.js. This is the password any modifications to the lexicon.
here's a sample of what's needed in it:

``
var validPass = function(p){
	return (p == "some passphrase 1234");
}
``


## API calls (so far):
``GET /word/[word]``
get word by wordname

``GET /word/``
all words

``POST /word/wordnew``
update/creates a new word. requires name, meaning, and password.

``DELETE /word/[word]``
delete the word. requires password.