var  mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({

  username: String,
  password: String,
  fullName: String,
  email: {type: String, unique: true, required: true},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  Batch:String,
  class:String,

  AttemptedTests:[
    {
        id:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "testRecord"
        },
        heldOn:Date,
        marksObtained:Number,
        }
  ]
  
  

}, {
  usePushEach: true
});



UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);