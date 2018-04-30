var express = require('express');
var router = express.Router();
var cert = require('./cert');

var cert_image; /* Ugly global :( */

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cert_form');
});

router.get('/cert_form/submit/:fname/:lname',function(req,res,next) {
  console.log("Rendering "+cert_image);
  res.render('cert',{cert_image: cert_image});
}
);

/* Post */
router.post('/cert_form/submit', function(req,res,next) {

  
  var fname = req.body.fname;
  var lname = req.body.lname;
  var course = req.body.course;
  var stream = req.body.stream;
  var date = req.body.date;

  cert.generate(fname,lname,course,stream,date)
    .then(function(data){
      console.log("Certifcate generated for: "+ fname + lname);
      cert_image = data;
      res.redirect('/cert_form/submit' + '/' + fname + '/' + lname);
    })
  .catch(function (err) {
      console.log(err); 
  });
});

module.exports = router;
