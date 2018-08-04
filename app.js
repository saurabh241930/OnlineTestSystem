
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

app.get("/demoPaper",function(req,res){
	res.render("paper")
})





app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});