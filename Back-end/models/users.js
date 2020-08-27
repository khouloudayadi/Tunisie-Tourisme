
//dependencie
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
	token : String,//Un jeton est également stocké, utilisé pour changer le mot de passe.
	email: String,
	password: String,
	code: String,
	salt: String,
	adress: String,
	tel: Number,
	name: String
	 },{
    versionKey: false
});
module.exports = mongoose.model('users', userSchema);
