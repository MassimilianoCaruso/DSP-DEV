const test = require('tape'),
	httpHelper= require('../lib/http_helper.js'),
	errors = require('errors')





test('Should launch error if doesn\'t register an error type', (assert) => {

	assert.throws(() => httpHelper.register("noError", 500), "Launch an error for string")
	assert.end()
});

test('Should launch error if doesn\'t register a correct code', (assert) => {
	try { 
		httpHelper.register(new Error("Right error"), 10)
		assert.fail("NO ERROR LAUNCHED") 
		assert.end()
	   }

	catch(e) {
		assert.pass("OK, error sent")
		assert.end()
	}
});



test('http_code_for_error : should return correct code', (assert) => {

	httpHelper.register(new Error("myerror"), 502) 
	assert.equal(httpHelper.http_code_for_error(new Error("myerror")),
			502, "Should be 502" )
	assert.end()

});

test('http_code_for_error : should give default 503 error', (assert) => {

	httpHelper.register(new Error("myerror"), 502) 
	assert.equal(httpHelper.http_code_for_error(new Error("nomyerror")),
			503, "Default to 503 if no registered") 
	assert.end()
});
