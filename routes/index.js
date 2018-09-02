var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/User");
var test = require("../models/test");
var testRecord = require("../models/testRecord");

var question = require("../models/question");
var flash = require("connect-flash");

router.get("/profile", function (req, res) {
  User.findById(req.user._id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      var AttemptedTests = user.AttemptedTests;

      var testDates = [];
      var marksObtainedArray = [];




      const promises = AttemptedTests.map((item) => new Promise((resolve, reject) => {
        testRecord.findById(item.id, (err, testRecord) => {
          if (err) console.log(err);
          else {

            testDates.push(testRecord.createdOn.toDateString() + ",")
            marksObtainedArray.push(parseInt(testRecord.marksObtained))
          }

          resolve();
        });
      }));

      Promise.all(promises)
        .then(() => {



          res.render("profile", {
            testDates,
            marksObtainedArray
          });
        })





      // AttemptedTests.forEach(function(item, index, array) {
      //   asyncFunction(item, () => {
      //     itemsProcessed++;

      //     testRecord.findById(item.id, function(err, testRecord) {
      //       if (err) {
      //         console.log(err);
      //       } else {
      //         var testDate = testRecord.createdOn;
      //         var marksObtained = testRecord.marksObtained;

      //         console.log(testDate);
      //         console.log(marksObtained);

      //         testDates.push(testDate);
      //         marksObtainedArray.push(marksObtained);

      //         if (itemsProcessed === AttemptedTests.length) {
      //           callback();
      //         }
      //       }
      //     });
      //   });
      // });


    }
  });
});

router.get("/", (req, res) => {
  test.find({}, function (err, tests) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        tests: tests
      });
    }
  });
});

router.get("/test/:id", (req, res) => {
  test.findById(req.params.id, function (err, test) {
    if (err) {
      console.log(err);
    } else {
      question.find({
          testId: test._id
        },
        function (err, questions) {
          if (err) {
            console.log(err);
          } else {
            var testId = req.params.id;
            res.render("questionPaper", {
              questions: questions,
              testId: testId
            });
          }
        }
      );
    }
  });
});

router.post("/submitPaper/:testId", function (req, res) {
  User.findById(req.user._id, function (err, user) {
    if (err) {
      throw err;
    } else {
      var newTestRecord = {
        testId: req.params.testId,
        studentId: user._id,
        studentName: user.fullName
      };

      testRecord.create(newTestRecord, function (err, testRecord) {
        if (err) {
          throw err;
        } else {
          Object.entries(req.body).forEach(function ([questionsId, enteredKey]) {
            question.findById(questionsId, function (err, question) {
              if (err) {
                throw err;
              } else {
                if (
                  enteredKey.toString() === question.correctOption.toString()
                ) {
                  testRecord.marksObtained = testRecord.marksObtained + 4;
                  testRecord.save();
                } else if (enteredKey.toString() === "None") {
                  testRecord.marksObtained = testRecord.marksObtained;
                  testRecord.save();
                } else {
                  testRecord.marksObtained = testRecord.marksObtained - 1;
                  testRecord.save();
                }
              }
            });
          });

          var newTestAttemp = {
            id: testRecord._id,
            heldOn: testRecord.createdOn,
            marksObtained: testRecord.marksObtained
          };

          user.AttemptedTests.push(newTestAttemp);
          user.save();
        }
      });
    }
  });

  res.send("success");
});

//////////////////////////////////////////AUTH ROUTES////////////////////////////////////////
//register
router.get("/register", function (req, res) {
  res.render("register");
});

//Sign Up logic
router.post("/register", function (req, res) {
  var newUser = new User({
    username: req.body.username,
    fullName: req.body.fullName,
    class: req.body.class,
    email: req.body.email,
    Batch: req.body.Batch
  });

  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    }
  });
});

/////////////////////Login route///////////////////////////
router.get("/login", function (req, res) {
  res.render("login");
});

//login logic
// app.post('/login',middleware,callback)
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

////////////////// #### Middleware ##### for checking if user is logged in or not//////////////////////////////////////
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "You must be logged in to do that");
    res.redirect("/login");
  }
}

module.exports = router;