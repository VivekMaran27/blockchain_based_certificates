var express = require('express');
var router = express.Router();
var cert = require('./cert');

/* Ugly globals :( */
var g_cert_image;
var g_contract_address; 
var g_err;
var g_student_pub_key;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cert_form');
});

router.get('/cert_form/submit/:fname/:lname/:stud_pub_key',function(req,res,next) {
  console.log("Rendering response");
  console.log("Contract address: "+g_contract_address);
  res.render('cert',{cert_image: g_cert_image, 
                     stud_pub_key: g_student_pub_key,
                     contract_address: g_contract_address});
});

router.get('/cert_form/submit/error',function(req,res,next) {
  console.log("Rendering error");
  res.render('error',{error: g_err});
});

/* Post */
router.post('/cert_form/submit', function(req,res,next) {

  var fname = req.body.fname;
  var lname = req.body.lname;
  var course = req.body.course;
  var stream = req.body.stream;
  var date = req.body.date;
  var stud_pub_key = req.body.stud_pub_key;

  cert.generate(fname,lname,course,stream,date,stud_pub_key)
    .then(function(cert){
      console.log("Certifcate generated for: "+ fname + lname +"(" + stud_pub_key +")");
      console.log("certificate: "+ cert);
      g_cert_image = cert.cert_hash;
      g_contract_address = cert.contract_address;
      g_student_pub_key = stud_pub_key;
      res.redirect('/cert_form/submit' + '/' + fname + '/' + lname + '/' +stud_pub_key);
    })
  .catch(function (err) {
      g_err = err;
      console.log(err); 
      res.redirect('/cert_form/submit' + '/' + 'error');
  });
});

module.exports = router;
