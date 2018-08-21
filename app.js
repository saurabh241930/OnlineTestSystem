
var express           = require('express');
var app               = express();
var bodyParser        = require("body-parser");
var mongoose = require('mongoose')
var passport = require('passport')
var LocalStrategy = require('passport-local')

var question = require('./models/question');
var test = require('./models/test');
var User = require('./models/User');




var methodOverride = require('method-override');




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
  




app.get("/",(req,res)=>{

	test.find({},function(err,tests){
		if (err) {
			console.log(err);
			
		} else {
			res.render("home",{tests:tests})
		}
		
	})
	

})


app.get("/demoPaper",(req,res)=>{
	res.render("paper")
})




// admin
app.get("/tests",(req,res)=>{


	test.find({},function(err,tests){
		if (err) {
			console.log(err);
			
		} else {
			res.render("tests",{tests:tests})
		}
	})

	
})


app.get("/test/:id",(req,res)=>{

	test.findById(req.params.id,function(err,test){
		if (err) {
			console.log(err);	
		} else {		
			question.find({'testId':test._id},function(err,questions){
				if (err) {
					console.log(err);
					
				} else {
					res.render("questionPaper",{questions:questions})
				}
                     
			})
			
		}
	})



})

// admin
app.get("/addQuestions/:id",(req,res)=>{

	test.findById(req.params.id,function(err,test){
		if (err) {
			console.log(err);
			
		} else {
			
			res.render("questionForm",{test:test})
		}
	})



})

// admin
app.get("/testForm",(req,res)=>{
	res.render("testForm")
})


// admin
app.post("/submitTest",(req,res)=>{

	var newTest = {
		forBatch:req.body.forBatch
		
	}

		test.create(newTest,function(err,test){
			if (err) {
				console.log(err);
				
			} else {
				console.log(test);
				
			}
})


})



// admin
app.post("/submitQuestion/:id",(req,res)=>{

	var newQuestion = {
		QuestionLink:req.body.QuestionLink,
		correctOption:req.body.correctOption,
		testId:req.params.id
	}

		question.create(newQuestion,function(err,question){
			if (err) {
				console.log(err);
				
			} else {
				console.log(question);
				res.redirect("back")
			}
})


})








app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});