
// get required modules
var fs = require('fs')
	, configFile = require('../config');
	
// define the folder in which we'll find the cert and key files
var prefix = (String(configFile.https) === 'true') 
	? (process.cwd() + '/.ssl') : configFile.https;

// define the paths to the cert and key files
var certFilePath = prefix + '/' + (configFile.cert || "adminion-cert.pem")
	, keyFilePath = prefix + '/' + (configFile.key 	|| "adminion-key.pem");
	
module.exports = 
{
	/**
	 * key: A string or Buffer containing the private key of the server in PEM format. (Required)
	 * cert: A string or Buffer containing the certificate key of the server in PEM format. (Required)
	 * 
	 * @see: http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener
	 */
	data : {
		cert : fs.readFileSync(certFilePath).toString('ascii')
		, key : fs.readFileSync(keyFilePath).toString('ascii')
	}
	, path : { 
		cert : certFilePath
		, key : keyFilePath 
	}
};

//console.log('lib/ssl.js ssl', ssl);