
var config = require('./index');

var express = module.exports = {
	host 		: 'localhost',						// default: 'localhost'
	port 		: '1337',							// default: '8080'	
	protocol	: 'http',							// default: 'http'
	pub 		: config.prefix + '/public',		// default: '../public'
	controllers	: config.prefix + '/controllers',	// default: '../routes'
	views		: config.prefix + '/views',			// default: './views' 
	viewEngine 	: 'jade'							// default: 'jade'
};

express.favicon = express.pub + 'favicon-dark.ico';
