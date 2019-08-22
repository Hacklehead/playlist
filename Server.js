const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const multipart = require("connect-multiparty");
const cors = require("cors");

const router = express.Router();
const app = express();

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var db = require("./dbController.js");
var acc = require("./dbAccess.js");
var TYPES = require("tedious").TYPES;

const jwt = require("jsonwebtoken");

const multipartMiddleware = multipart();

app.use(cors());
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.static(__dirname + '/views'));

app.set('view engine', 'ejs');
app.use( express.static( "public" ) );

var urlencodedParser = bodyParser.urlencoded({ extended: true });

var sess; // global session, NOT recommended
var output;


router.get('/LoanMaster',function(req,res){

	acc.getLoans(132,res);
});

router.get('/newaccount',function(req,res){
	res.render('NewAccount');
	
});

router.get('/',function(req,res){
	res.render('Entry');
	
});

router.get('/xxxentry',function(req,res){

	res.render('Entry');
	
});

app.post('/LoanMaster',urlencodedParser, function(req, res){

	console.log('LoanMaster');
  
	var suserid = JSON.stringify(req.body.userid); 
	var spassword = JSON.stringify(req.body.password); 
  
	//acc.getUserLoans(132,suserid,res);
	acc.getUserLoans(132,'Hacklehead',res);

  });

  app.post('/newloan',urlencodedParser, function(req, res){

	console.log('new loan');
  
	var suserid = JSON.stringify(req.body.userid); 
	var snewloan = JSON.stringify(req.body.loanname); 
	console.log(suserid);
	console.log(snewloan);

	if(snewloan != '--'){acc.getNewLoanStatus(132,suserid,snewloan,res);}
	
  });

  app.post('/copyloan',urlencodedParser, function(req, res){

	console.log('copy loan');
  
	var suserid = JSON.stringify(req.body.copyuserid); 
	var ssrceloan = JSON.stringify(req.body.srceloanname); 
	var sdestloan = JSON.stringify(req.body.destloanname); 
	console.log(suserid);
	console.log(sdestloan);

	if(sdestloan != '--'){acc.getCopyLoanStatus(132,suserid,ssrceloan,sdestloan,res);}
	
  });

  app.post("/connect", multipartMiddleware, function(req, res) {
  //app.post('/connect',urlencodedParser, function(req, res){

	var suserid = JSON.stringify(req.body.title); 
	var spwd = JSON.stringify(req.body.content); 

	suserid = suserid.replace(/\"/g, ""); 
	spwd = spwd.replace(/\"/g, ""); 
	suserid = suserid.replace(/\\/g, ""); 
	spwd = spwd.replace(/\\/g, ""); 

	console.log(suserid + '-' + spwd);

	var buff =acc.getLoginStatus_vue(suserid,spwd,res);	
	console.log(buff);
	return res.json({
		status: true,
		message: "connection"
	  });

	/*
	var suserid = JSON.stringify(req.body.copyuserid); 
	var ssrceloan = JSON.stringify(req.body.srceloanname); 
	var sdestloan = JSON.stringify(req.body.destloanname); 
	console.log(suserid);
	console.log(sdestloan);

	if(sdestloan != '--'){acc.getCopyLoanStatus(132,suserid,ssrceloan,sdestloan,res);}
	*/
  });


  app.post("/loadloans", multipartMiddleware, function(req, res) {
	//app.post('/connect',urlencodedParser, function(req, res){
  
	  var suserid = JSON.stringify(req.body.title); 
	  var spwd = JSON.stringify(req.body.content); 
  
	  suserid = suserid.replace(/\"/g, ""); 
	  spwd = spwd.replace(/\"/g, ""); 
	  suserid = suserid.replace(/\\/g, ""); 
	  spwd = spwd.replace(/\\/g, ""); 
  
	  console.log(suserid + '-' + spwd);
  
	  //var buff =acc.getLoginStatus_vue(suserid,spwd,res);	
	  //var buff= acc.getUserLoans(132,suserid,res);
	  var buff= acc.getUserLoans_vue(suserid,spwd,res);
	  	
	  console.log('buff=' + buff);
	  	/*
	  	return res.json({
		  status: true,
		  message: "loadloans"
		});
		*/	
	  
	});

  app.post('/editloan',urlencodedParser, function(req, res){

	console.log('edit loan');
  
	var suserid = JSON.stringify(req.body.edituserid); 
	
	var sloan = JSON.stringify(req.body.editloanname); 
	var sStartDate = JSON.stringify(req.body.editstartdate); 
	var spmtyear = JSON.stringify(req.body.editpmtyear); 
	var srate = JSON.stringify(req.body.editrate); 
	var srateper = JSON.stringify(req.body.editrateper); 
	var sbalance = JSON.stringify(req.body.editbalance); 
	var spmt = JSON.stringify(req.body.editpayment); 
	var snumpmt = JSON.stringify(req.body.editnumpmts_num); 
	var smethod = JSON.stringify(req.body.editmethod); 
	
	console.log(suserid);
	console.log(sloan);
	console.log(sStartDate);
	console.log(spmt);
	console.log(snumpmt);
	console.log(smethod);		

	if(sloan != '--'){acc.editLoan(132,suserid,sloan,sStartDate,spmtyear,srate,srateper,sbalance,spmt,snumpmt,smethod,res);}
	
  });

  app.post('/deleteloan',urlencodedParser, function(req, res){

	console.log('delete loan');
  
	var suserid = JSON.stringify(req.body.deleteuserid); 
	var sdeleteloan = JSON.stringify(req.body.deleteloanname); 
	console.log(suserid);
	console.log(sdeleteloan);

	if(sdeleteloan != '--'){acc.deleteLoan(132,suserid,sdeleteloan,res);}
	
  });

app.post('/login',urlencodedParser, function(req, res){

  console.log('Logging in');

  var suserid = JSON.stringify(req.body.userid); 
  var spassword = JSON.stringify(req.body.password); 

  acc.getLoginStatus(suserid,spassword,res);	
  
});

app.post('/newaccount',urlencodedParser, function(req, res){

  console.log('Logging in');

  var suserid = JSON.stringify(req.body.userid); 
  var semail = JSON.stringify(req.body.email); 
  var spassword = JSON.stringify(req.body.password); 
  var spassword2 = JSON.stringify(req.body.password2); 

  if(spassword == spassword2){
  acc.addNewAccount(suserid,semail,spassword,res);	
  }
  
});


router.get('/xxxmainmenu',function(req,res){
	res.render('mainmenu');
	
});

router.get('/loadloan',function(req,res){
	console.log('Load Loan');
	
});

router.get('/quickcalculator',function(req,res){
	res.render('quickcalculator');
	
});

router.post('/mainmenu',(req,res) => {
	console.log(`Step 2`);
	
	res.render('Mainmenu');
	
    res.end('done');
});


router.get('/admin',(req,res) => {
	res.render('admin');

});

router.get('/newloanadded',(req,res) => {
	res.render('newloanadded');
	
});

router.get('/loanexists',(req,res) => {
	res.render('loanrefresh');
	
});

router.get('/newaccounterror',(req,res) => {
	res.render('newaccounterror');
	
});

router.get('/logout',(req,res) => {
	console.log(`Step 4`);
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});

// Create middleware for protecting routes
app.use(function(req, res, next) {
	// check header or url parameters or post parameters for token
	let token =
	  req.body.token || req.query.token || req.headers["x-access-token"];
  
	// decode token
	if (token) {
	  // verifies secret and checks exp
	  jwt.verify(token, app.get("appSecret"), function(err, decoded) {
		if (err) {
		  return res.json({
			success: false,
			message: "Failed to authenticate token."
		  });
		} else {
		  // if everything is good, save to request for use in other routes
		  req.decoded = decoded;
		  next();
		}
	  });
	} else {
	  // if there is no token
	  // return an error
	  return res.status(403).send({
		success: false,
		message: "No token provided."
	  });
	}
  });

app.use('/', router);

app.listen(process.env.PORT || 3000,() => {
    console.log(`New Version 2`);
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});