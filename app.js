
var express           = require('express');
var app               = express();
var bodyParser        = require("body-parser");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));



app.get("/",(req,res)=>{
	
	res.render("home")
})
app.get("/",(req,res)=>{
	
	res.render("main")
})





app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});