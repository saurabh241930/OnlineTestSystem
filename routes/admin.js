var express = require('express');
var router = express.Router();
var passport = require('passport');
var methodOverride = require('method-override');
   
var path = require('path');
var fs = require('fs');


var question = require('../models/question');
var test = require('../models/test');
var User = require('../models/User');

 var async = require("async");


 router.get("/tests",(req,res)=>{


	test.find({},function(err,tests){
		if (err) {
			console.log(err);
			
		} else {
			res.render("tests",{tests:tests})
		}
	})

	
})



router.get("/test/:id",(req,res)=>{

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



router.get("/addQuestions/:id",(req,res)=>{

	test.findById(req.params.id,function(err,test){
		if (err) {
			console.log(err);
			
		} else {
			
			res.render("questionForm",{test:test})
		}
	})

})


router.get("/testForm",(req,res)=>{
	res.render("testForm")
})



router.post("/submitTest",(req,res)=>{

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




router.post("/submitQuestion/:id",(req,res)=>{

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




 module.exports = router;