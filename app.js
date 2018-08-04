
var express           = require('express');
var app               = express();
var bodyParser        = require("body-parser");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));



app.get("/",(req,res)=>{
	
	res.render("home")
})
app.get("/login",(req,res)=>{
	
	res.render("login")
})

app.get("/demoPaper",(req,res)=>{
	res.render("paper")
})

app.get("/JEE-Test",(req,res)=>{
	res.render("JEE-TEST")
})

app.get("/NEET-TEST",(req,res)=>{
	res.render("NEET-TEST")
})

app.get("/JEE-STUDENTS",(req,res)=>{
	res.render("JEE-STUDENTS")
})


app.get("/NEET-STUDENTS",(req,res)=>{
	res.render("NEET-STUDENTS")
})





app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});