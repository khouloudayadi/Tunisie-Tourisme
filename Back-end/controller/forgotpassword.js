//dependencie
var mongoose = require('mongoose');
var rand = require('csprng');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

//get models  users
var users = require('../models/users');

//var code = 'rand(24, 24)';
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "your email",
        pass: "your password"
     }
});

// générer salt
var genRandomString = function(length){
  return crypto.randomBytes(Math.ceil(length/2)) //Nous utiliserons la fonction randomBytes de crypto pour générer une chaîne de caractères aléatoires qui sera utilisée comme sel.
      .toString('hex') //convertir au format hexadécimal
      .slice(0,length); //retourne le nombre de caractères requis
};
// Hashing le mot de passe avec du sel
var sha512 = function(password,salt){
  var hash = crypto.createHmac('sha512', salt); //Crée un objet Hmac en utilisant l'algorithme SHA512 et la clé spécifiés salt
  hash.update(password);
  var value = hash.digest('hex');
  return {
    salt:salt,
    passwordHash:value
   };
};

function saltHashPassword(userPassword){
  var salt = genRandomString(16);//générer  une chaîne de caractères aléatoire de longeur 16
  var passwordData = sha512(userPassword,salt); // userpassword:mot de passe entré par l'utilisateur && salt : clé
  return passwordData;
}


exports.forgotpassword = function(email,callback){
var code = rand(24, 24);
  users.find({'email': email},function(err,users){
    if(users.length != 0){
    /*  users.find({'email': email }, function (err, users){*/
         users[0].code = code;
         users[0].save();
                var mailOptions = {
                  from: "Tunisie Tourisme <tunisietourisme2@gmail.com>",
                  to: email,
                  subject: "Reset your account password",
                  html: "<h4><b>Reset Password</b></h4><br>" +
                        "<p> Hello "+email+".<br>Code to reset your Password is <b>"+code+"</b>.<p>",
                 }
                smtpTransport.sendMail(mailOptions, function(err, response){
                    if(err){
                      callback({'response':err,'res':false});
                    }
                    else{
                      callback({'response':"true",'res':true});
                    }
                });

  /* });*/
 }
   else {
     callback({'response':"No user found with that email address.",'res':false});
    }

});
}


exports.resetpassword_chg = function(email,code_saisie,newpassword,callback) {

  var hash_data = saltHashPassword(newpassword);
  var plaint_password = hash_data.passwordHash; //get hash value
  var salt = hash_data.salt; // get salt
  var updateJson = {
           'password': plaint_password,
           'salt': salt,
           'code': ""
         };
users.find({'email':email},function(err,users){
  var len = users.length;
    if(len != 0){
        var code = users[0].code;
          if(code_saisie == code){
              users[0].update({'email':email}, {$set: updateJson},function (err) {
              callback({'response':'Password Sucessfully Changed','res':true});
              });
           }
          else{
            callback({'response':'Code does not match. Try Again !','res':false});
           }
    }
    else{
      callback({'response':'Error','res':false});
    }
});
}
