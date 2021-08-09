const printDbg = require('./lib/print_dbg') ,
	strings = require('./lib/strings.js'),
	promises = require('./lib/promises'),
	checker = require('./lib/checker.js') ,
	data = require('./lib/data.js'),
	httpHelper= require('./lib/http_helper.js')
	
var api = {
	printDbg : printDbg	, 	
	strings : strings, 
	promises : promises,
	data : data,
	checker : checker,
	httpHelper : httpHelper
}


module.exports = api
