#!/bin/env node

'use strict';

var express    = require('express');
var mongoose   = require('mongoose');
// var path       = require('path');
// var fs         = require('fs');
var jwt        = require('jsonwebtoken');  //https://npmjs.org/package/node-jsonwebtoken
var expressJwt = require('express-jwt'); //https://npmjs.org/package/express-jwt
// var bodyParser = require('body-parser');
var config     = require('./config');
var app        = express();

var db = mongoose.connect(config.mongo.uri);

var port = process.env.PORT || config.port; // set our port

var USERS = config.usrs;

require('./routes')(app);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

