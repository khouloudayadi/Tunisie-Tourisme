//dependencie
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

var register =require('../controller/register');
var login = require('../controller/login');
var forgotpassword = require('../controller/forgotpassword');

module.exports = function(app) {

app.post('/register',function(request,response,next){

		var userinfo = request.body; // get post param
  		var email = userinfo.email;
  		var password = userinfo.password; //get password from post params
  		var name = userinfo.name;

		register.register(email,password,name,function (found) {
			console.log(found);
			response.json(found.response);
	    });
	});


app.post('/login',function(request,response,next){

		var userinfo = request.body; // get post param
  		var password = userinfo.password; //get password from post params
  	    var email = userinfo.email;

		login.login(email,password,function (found) {
			console.log(found);
			response.json(found.response);
	    });
	});

app.post('/forgot-password',function(request,response,next){

			var userinfo = request.body; // get post param
	  	   var email = userinfo.email;

			forgotpassword.forgotpassword(email,function (found) {
				console.log(found);
				response.json(found.res);
		   });
});

app.put('/resetpassword_chg/:email', function(request, response,next) {

				var email = request.params.email;
				var userinfo = request.body; // get post param
				   var code_saisie = userinfo.code_saisie;
				   var newpassword = userinfo.newpassword;

				forgotpassword.resetpassword_chg(email,code_saisie,newpassword,function(found){
					console.log(found);
					response.json(found.res);
		    	});
});


}
