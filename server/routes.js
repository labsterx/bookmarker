/**
 * Main application routes
 */

'use strict';

var express    = require('express');
var path       = require('path');
var fs         = require('fs');
var jwt        = require('jsonwebtoken');  //https://npmjs.org/package/node-jsonwebtoken
var expressJwt = require('express-jwt'); //https://npmjs.org/package/express-jwt
var bodyParser = require('body-parser');
var config     = require('./config');

module.exports = function(app) {

	var auth = require('./controllers/auth');
	var categories = require('./controllers/category');
	var links = require('./controllers/link');

	app.use(bodyParser());
	app.use(express.static(path.join(__dirname, '../client')));
	app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));

	app.use('/api', expressJwt({secret: config.jwt.secret}));

	app.use(function(err, req, res, next){
		if (err.constructor.name === 'UnauthorizedError') {
			res.send(401, 'Unauthorized');
		}
	});

	// Auth
	app.post('/auth', auth.auth);
	// app.post('/auth/encrypt', auth.encrypt);
	// app.post('/auth/check', auth.check);
	// app.get('/auth/test', auth.test);
	app.post('/api/refreshtoken', auth.refreshToken);

	// Categories
	app.get('/api/categories', categories.index);
	app.post('/api/categories', categories.create);
	app.get('/api/categories/:id', categories.findById);
	app.put('/api/categories/:id', categories.update);
	app.delete('/api/categories/:id', categories.delete);

	// Links
	app.get('/api/links', links.index);
	app.post('/api/links', links.create);
	app.get('/api/links/:id', links.findById);
	app.put('/api/links/:id', links.update);
	app.delete('/api/links/:id', links.delete);

	// Tests
	app.get('/foo', function(req, res) {
		res.json({ message: '/foo' });
	});

};
