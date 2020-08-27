var crypto = require('crypto');
var mongoose = require('mongoose');
//Génère des nombres aléatoires t.que Les nombres peuvent être de n'importe quelle grandeur et dans n'importe quelle base de 2 à 36.
var rand = require('csprng');
//get models  users
var users = require('../models/users');

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
/*
function checkHashPassword(userPassword,salt){
  var passwordData = sha512(userPassword,salt);
  return passwordData; }
*/

exports.register = function(email,password,name,callback)  {

var hash_data = saltHashPassword(password);
var plaint_password = hash_data.passwordHash; //get hash value
var salt = hash_data.salt; // get salt
var token = crypto.createHash('sha512').update(email +rand).digest("hex");// hashing email avec rand

var newuser = new users({
     token: token ,
     email: email,
     password: plaint_password,
     salt: salt,
     name: name
    });

users.find({'email': email},function(err,users){
  var len = users.length;

    if(len == 0){
      newuser.save(function (err) {
          callback({'response':"Registration Success"});
        });
    }
    else{
          //response.json("Email alredy exists");
           callback({'response':"Email alredy exists"});
    }
});
}
