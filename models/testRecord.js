var mongoose = require('mongoose');


var TestRecordSchema = new mongoose.Schema({


testId: {
	type: mongoose.Schema.Types.ObjectId,
	ref: "test"
     },

createdOn:{type:Date,default:Date.now},

studentId:{
	type: mongoose.Schema.Types.ObjectId,
	ref: "user"
},

studentName:String,
           
marksObtained:{type:Number , default:0},
totalCorrectQuestion:Number,
totalUnattendedQuestion:Number

  
  

}, {
  usePushEach: true
});





module.exports = mongoose.model("testRecord", TestRecordSchema);