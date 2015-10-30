var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var app = express();
var LocalStrategy = require('passport-local')


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

var sessionOpts = {
	saveUninitialized: true, // saved new sessions
	resave: false, // do not automatically write to the session store
	secret: 'secret',//Needs some secret string to initialize, can be empty, but this would be an .env var usually.
	cookie : { secure: false, httpOnly: true, maxAge: 2419200000 } // more config
}

app.use(session(sessionOpts)); 

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
	//console.log("Serialize User: ", user);
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	//console.log("De-Serialize User: ", user);
	done(null, user);
});

var port = process.env.PORT || 3030;
var router = express.Router();

router.post('/createsession', function (req, res) {
	var user = req.body;

	req.logIn(user, function (err) {
	   
	    console.log(req.isAuthenticated());
	    if (err) { console.log("Some Error serializing the user in session:",err); }
	    //console.log(req);
	    //res.status("Success").send(user);
	    res.json(user);
	});
});

router.get('/getuser', function (req, res) {
	res.json(req.user);
});
router.post('/endsession', function (req, res) {
	req.session.destroy();//Ends the Express session
	req.logout();//Ends the Passport session
	console.log(req);
	res.send('LoggedOut');//Redirect from here wasnt working for some reason...
});

router.get('*', function(req, res){
	//console.log(req);
	res.sendfile('./public/index.html');
});

app.use('/', router);

app.listen(port);
console.log('Listening on port 3030');
