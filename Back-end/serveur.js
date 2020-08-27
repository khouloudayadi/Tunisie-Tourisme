//dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//connect to mongodb
mongoose.connect('mongodb://khouloudayadi:azerty123@ds241537.mlab.com:41537/tunisie-tourisme')
    .then(() => { // if all is ok we will be here
      console.log('Start');
    })
    .catch(err => { // if error we will be here
        console.error('App starting error:', err.stack);
        process.exit(1);
    });

//express
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//routes
require('./routes/api')(app);

//start serveur

app.listen(3000);
console.log('Server is running on Port:3000');
