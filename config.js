/**
 * URL connection format
 * mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
 * 
 * In below connection URL format
 * localhost:27017 = server:port, default port is 27017, port value is optional
 * gramsetudb = our database name
 * 
 * See more: https://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html
 */ 
var config = {
	database: {
		//url: 'mongodb://localhost:27017/gramsetudb'
		//url: 'mongodb://admin:Password123@ds153766.mlab.com:53766/heroku_ssbjmgrf'
		url: 'mongodb://localhost:27017/safexdb'
	},
	server: {
		host: '127.0.0.1',
		port: '3000'
	},
	secret: 'worldisfullofdevelopers'
}

module.exports = config
