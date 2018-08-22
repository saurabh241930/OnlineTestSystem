var mongoose = require('mongoose');


var QuestionSchema = new mongoose.Schema({

QuestionLink:String,

createdOn:{type:Date,default:Date.now},

testId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "test"
     },

correctOption:String,

attemptedStudents:[{
    id:{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Student"
    },
    fullname: String,
    fromBatch:String
    }]
  
  

}, {
  usePushEach: true
});



module.exports = mongoose.model("question", QuestionSchema);