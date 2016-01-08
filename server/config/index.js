'use strict';

var mongo_uri = 'mongodb://[SECRET_URI]';
if (process.env.BOOKMARKER_MONGO_URI) {
	mongo_uri = process.env.BOOKMARKER_MONGO_URI;
}

module.exports = {
	port: 5000,
	mongo: {
		uri: mongo_uri
	},
	jwt: {
		secret: '[SECRET]'
	},
	users: [
		{
			id: 1,
			username: 'test',
			password: '[encrypted passwd]',
			role: 'superadmin'
		},
	]
};
