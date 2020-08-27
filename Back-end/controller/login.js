//dependencie
var crypto = require('crypto');
var mongoose = require('mongoose');
var gravatar = require('gravatar');

//get models  users
var users = require('../models/users');
// create function to random salt
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

exports.login = function(email,password,callback)  {
    users.find({'email':email},function(err,users){
      var len = users.length;
        if(len != 0){
             var salt = users[0].salt; //get salt from user
             var hashed_password = sha512(password,salt).passwordHash;
             var encrypted_password = users[0].password; // get password from user
              var token = users[0].token;
             var grav_url = gravatar.url(email, {s: '200', r: 'pg', d: '404'});
                if(encrypted_password == hashed_password) {
                  //response.json("Login Sucess");
                  callback({'response':'Login Sucess','res':true,'img_profil':grav_url,'token':token});
                }
                else {
                  //response.json("Wrong Password");
                  callback({'response':'Wrong Password','res':false});
                }
        }
        else {
          callback({'response':'Wrong Email','res':false});
        }
   });

  }
