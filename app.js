
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






/////////////////////////user sign in////////////////////////////////////////

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/register",function(req,res){
  var newUser  = new User({username:req.body.username, fullName:req.body.fullName, email:req.body.email, class:req.body.class, Batch:req.body.Batch });

  var password = req.body.password;
  
  
  User.register(newUser, password, function(err, user){
    if(err){
      console.log(err);
      
    } else{
       passport.authenticate("local")(req, res, function(){
       res.redirect("/");
    });
    }
  });
});
 






app.post("/login", passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect:"/login"
}), function(req,res){
});

////////////////////////logout/////////////////////

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect("/login");
  }
}



//==========================================================forgot password================================================//

// forgot password
app.get('/forgot', function(req, res) {
  res.render('forgot');
});


app.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: process.env.Email,
          pass: process.env.GMAILPASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'chiragprajapati781@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'https://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});



//==============================token=======================//


app.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

app.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: process.env.Email,
          pass: process.env.GMAILPASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'chiragprajapati781@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' for https://' + req.headers.host + ' site has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/campgrounds');
  });
});





app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});