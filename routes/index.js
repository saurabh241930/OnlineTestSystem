var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var test = require('../models/test');
var question = require('../models/question');
var flash = require('connect-flash');




 router.get("/",(req,res)=>{
  test.find({},function(err,tests){
    if (err) {
      console.log(err);
    } else {
      res.render("home",{tests:tests})
    }
  })
})









//////////////////////////////////////////AUTH ROUTES////////////////////////////////////////
//register
router.get('/register',function(req,res){
  res.render('register');
});

//Sign Up logic
router.post('/register',function(req,res){
var newUser = new User ({username: req.body.username,
                         fullName: req.body.fullName,
                         class: req.body.class,
                         email: req.body.email,
                         Batch: req.body.Batch,
                       });


User.register(newUser,req.body.password,function(err,user){
if (err) {
console.log(err);
return res.render('register');
} else {
passport.authenticate("local")(req,res,function(){
res.redirect('/');
})
}

})

});


/////////////////////Login route///////////////////////////
router.get('/login',function(req,res){
res.render('login');
});

//login logic
// app.post('/login',middleware,callback)
router.post('/login',passport.authenticate("local",
{successRedirect: "/",
failureRedirect: "/login"
}),function(req,res){

});


router.get('/logout',function(req,res){
req.logout();
res.redirect('/');
});


////////////////// #### Middleware ##### for checking if user is logged in or not//////////////////////////////////////
function isLoggedIn(req,res,next){
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error","You must be logged in to do that");
    res.redirect('/login');
  }
}


 module.exports = router;    