
var express           = require('express');
var app               = express();
var bodyParser        = require("body-parser");
var mongoose = require('mongoose')
var passport = require('passport')
var LocalStrategy = require('passport-local')

var question = require('./models/question');
var test = require('./models/test');
var User = require('./models/User');

var authRoutes = require('./routes/index');
var adminRoutes = require('./routes/admin');


var methodOverride = require('method-override');


app.use(authRoutes);
app.use(adminRoutes);

//////////////////////////////////////////////////////////////////////////
  mongoose.Promise = global.Promise;
  var url = process.env.DATABASEURL || "mongodb://localhost/test"
  
	 mongoose.connect(url);
	 app.set('view engine','ejs');
	 app.use(express.static(__dirname +'/public'));
	 app.use(bodyParser.urlencoded({extended:true}));
	 app.use(methodOverride('_method'));
///////////////////////////////////////////////////////////////////////////

app.use(require('express-session')({
	secret: "This is secret",
	resave: false,
	saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  
  //================================================PASSPORT CONFIGURATION==================================================//
  
  
  /////passing "currentUser" to every template/////////////////
  app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
  })
  







app.get("/demoPaper",(req,res)=>{
	res.render("paper")
})













app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});