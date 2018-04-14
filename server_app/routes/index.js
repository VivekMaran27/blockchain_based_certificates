var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cert_form');
});

router.get('/cert_form/submit/:fname/:lname',function(req,res,next) {
  res.render('cert',{fname: req.params.fname, lname: req.params.lname});
}
);

/* Post */
router.post('/cert_form/submit', function(req,res,next) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var course = req.body.course;
  var stream = req.body.stream;
  var date = req.body.date;
  
  console.log("Student first name " + fname ); 
  console.log("Student last name " + lname ); 
  console.log("Course "+course);
  console.log("Stream "+stream);
  console.log("Date "+date);
  res.redirect('/cert_form/submit' + '/' + fname + '/' + lname);
});

module.exports = router;
