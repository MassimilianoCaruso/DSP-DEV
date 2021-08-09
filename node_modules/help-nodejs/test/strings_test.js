const test = require('tape')
const before = test;
const after = test;
const _ = require('underscore'),
	strings= require('../lib/strings')



// Try this, instead:
const setup = () => {
  const fixtures = {};

  // Insert your fixture code here.
  // Make sure you're creating fresh objects each
  // time setup() is called.
  return fixtures;
};

const teardown = (fixtures) => {
  // Dispose of your fixtures here.
};


//before('before', function (assert) {
//
//
//  assert.end();
//});

(substringTests= function ()  { 
	var substringTests = [
	{	
		name : "test character simple", 
		value : "proviamo;stringa fra@ tentativo",
		first : ";",
		second : "@",
		expected : "stringa fra",
	},
	{
		name : "Repetuted first and second", 
		value : "; still inside; internal @ i try@ end",
		first : ";",
		second : "@",
		expected : " still inside; internal @ i try",
	},
	{
		name : "Test with words", 
		value : "### internal### @@@ i try@@@",
		first : "###",
		second : "@@@",
		expected : " internal### @@@ i try",
	},
	{
		name : "Test without second", 
		value : "this is a string #until the end",
		first : "#",
		expected : "until the end"

	},
	{
		name : "Test empty second", 
		value : "this is a string #until the end",
		first : "#",
		second : "",
		expected : "until the end"

	},
	{
		name : "Extract git username and password", 
		value : "https://g.per45:@miapassword@@gitlab.com/g.per45/testlab.git",
		first : "https://",
		second : "@",
		expected : "g.per45:@miapassword@"
	},
	{
		name : "Should not extract nothing (empty string)", 
		value : "https://gitlab.com/g.per45/testlab.git",
		first : "https://",
		second : "@",
		expected : ""
	},
	{
		name : "Should return an empty string don't find first character", 
		value : "peterhateme",
		first : "bu",
		second : "any",
		expected : ""
	}

	]

	_.each(substringTests, function(ss) { 

		test(ss.name, (assert) => { 
			if(ss.second) 
				actual = strings.substring(ss.value, ss.first, ss.second)
			else actual = strings.substring(ss.value, ss.first)
			assert.equal(actual, ss.expected, 
				"###"+ss.value+"###"+ " should be substringed to ###"+ss.expected+"###"
			)

			assert.end()
		})


	})
})();

//Remove tests
(removeTests= () => {
	
	var toRemoveTests = [
	{	
		name : "test  simple", 
		value : "miastring",
		toRemove : "mia",
		expected: "string" 
	},
	{	
		name : "test  only first", 
		value : "miastringmia",
		toRemove : "mia",
		expected: "stringmia" 
	},
	{	
		name : "test global", 
		value : "miastringmia",
		toRemove : "mia",
		expected: "string",
		global : true
	},
	{	
		name : "test with strange characters", 
		value : "gijeri\// gewaegnwoegwain \//",
		toRemove : "\//",
		expected: "gijeri gewaegnwoegwain ",
		global : true
	},
	{	
		name : "Should return the same", 
		value : "peterhateme",
		toRemove : "nona",
		expected: "peterhateme",
		global : true
	}

	]

	_.each(toRemoveTests, (e) => {
			test(e.name, (assert) => {
				assert.equal(strings.remove(e.value, e.toRemove, e.global), 
					e.expected, 
					"Should remove" 
				)

				assert.end()
			})	
	})


}
)();



//Remove tests
(addTests= () => {
	
	var toAddTests = [
	{	
		name : "test  simple", 
		value : "miastring",
		toAdd : "ana",
		after : "str",
		expected: "miastranaing" 
	},

	{	
		name : "At the start", 
		value : "peppino pazzo",
		toAdd : "er ",
		expected: "er peppino pazzo" 
	},
	{	
		name : "With the same word inside at the end", 
		value : "peppino pazzo",
		toAdd : "zzo",
		after : "o",
		global : true,
		expected: "peppinozzo pazzozzo" 
	},
	{	
		name : "simple with global", 
		value : "is my string very growing",
		toAdd : " powered",
		after : "ing",
		global : true,
		expected: "is my string powered very growing powered" 
	}
	]

	_.each(toAddTests, (e) => {
			test(e.name, (assert) => {
				assert.equal(strings.add(e.value, e.toAdd, e.after, e.global), 
					e.expected, 
					"Should remove" 
				)

				assert.end()
			})	
	})


}
)();




//Remove tests
(removeTests= () => {
	
	var toRemoveTests = [
	{	
		name : "test  simple", 
		value : "miastring",
		toRemove : "mia",
		expected: "string" 
	},
	{	
		name : "test  only first", 
		value : "miastringmia",
		toRemove : "mia",
		expected: "stringmia" 
	},
	{	
		name : "test global", 
		value : "miastringmia",
		toRemove : "mia",
		expected: "string",
		global : true
	},
	{	
		name : "test with strange characters", 
		value : "gijeri\// gewaegnwoegwain \//",
		toRemove : "\//",
		expected: "gijeri gewaegnwoegwain ",
		global : true
	},
	{	
		name : "Should return the same", 
		value : "peterhateme",
		toRemove : "nona",
		expected: "peterhateme",
		global : true
	}

	]

	_.each(toRemoveTests, (e) => {
			test(e.name, (assert) => {
				assert.equal(strings.remove(e.value, e.toRemove, e.global), 
					e.expected, 
					"Should remove" 
				)

				assert.end()
			})	
	})


}
)();




