const test = require('tape'),
	checker= require('../lib/checker.js'),
	Joi = require('joi'),
	errors = require('errors')








test('Test wrong load', (assert) => {
	var c = checker.Checker()
	assert.throws(() => c.load('jack'), "Condition not satisfied launch")
	assert.throws(() => c.load({name:"jack"}),"Condition not satisfied launch")
	assert.throws(() => c.load({name:"cicio", conditionFn:"jack", error:"Err"}),"Condition not satisfied launch")
	
	  assert.end();
});


test("With simple conditions", (assert) => {
	var c = checker.Checker()
	c.load("simple", (e) => {
						return e > 10
				}
			, new Error("arg must be > 10"))

	//Sync mode
	assert.throws(() => c.check(9, "simple"), "Should throw exc")
	//With callback 
	c.check(9, "simple", (err) => { assert.notEqual(err, null, "Error should not be null")} )
	c.check(11, "simple", (err) => { assert.equal(err, null, "Error should be null")} )
	
	//c.load("Numberic", c.JoiCondition(Joi.number()), Joi.number().error)
	assert.end()

})


test("With JoiChecker", (assert) => {

	var c = checker.JoiChecker()
	var customMessage = 'String type error'
	var customError = new Error(customMessage)
	c.load("numeric", Joi.number())
	c.load("alphabetic", Joi.string().required(), customError)


	c.check(12, "numeric", (err) => {
		assert.equal(err, null, "Err should be null") 
	})

	c.check("string", "numeric", (err) => {
		assert.notEqual(err, null, "Err should not be null") 
	})

	assert.throws( () => c.check(14, "alphabetic") , "shoul throw exception")
	c.check(14, "alphabetic", (err) => {
		assert.notEqual(err, null, "Err should not be null") 	
		assert.equal(err.message, customMessage)
		assert.end()
	})

})


test("Should throw error if condition doesn't exists", (assert) => {
	var c = checker.JoiChecker()
	c.load("numeric", Joi.number())
	assert.throws(() =>c.check(14, "pumeric"), "Should throw an exception")
	
	c.check(14, "pumeric", (err) => {
		assert.notEqual(err, null)
		assert.equal(err.message, "Condition not registered", "Shuold give this message") 
		assert.end()
	})

});

test("Joi error ", (assert) => {
	var c = checker.JoiChecker()
	errors.create({name: "NoNumber",
 			defaultMessage: "No number inserted" 
			})
	var err = errors.find("NoNumber")

	c.load("numeric", Joi.number(), 
		new err())
	assert.throws(() => c.check("prova", "numeric"), "Should throw error")
	c.check("prova", "numeric", (err) => {
		assert.notEqual(err, null)
		assert.equal(err.message, "No number inserted")
	})
	assert.end()
		

})
