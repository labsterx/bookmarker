'use strict';

var mongo_uri = 'mongodb://[SECRET_URI]';
if (process.env.BOOKMARKER_MONGO_URI) {
	mongo_uri = process.env.BOOKMARKER_MONGO_URI;
}

module.exports = {
	port: 3000,
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
			password: '$2a$10$VzhVMMbW/gms4HVde90tnu3VouZ0o0jp6Bi4jzbG5UQpk7ZJ5TFRC',
			role: 'superadmin'
		},
	]
};
