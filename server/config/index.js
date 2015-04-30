'use strict';

var mongo_uri = 'mongodb://[SECRET]';
if (process.env.NEOTEC_CODE_LEVEL && process.env.NEOTEC_CODE_LEVEL == 'dev') {
	mongo_uri = 'mongodb://[SECRET]';
	console.log('Will use dev database.');
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
