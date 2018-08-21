var mongoose = require('mongoose');


var TestSchema = new mongoose.Schema({



createdOn:{type:Date,default:Date.now},
forBatch:String,
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





module.exports = mongoose.model("test", TestSchema);