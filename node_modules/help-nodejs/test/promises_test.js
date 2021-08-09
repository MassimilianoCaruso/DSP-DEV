const test = require('tape'), 
	p= require('../lib/promises.js'),
	fs = require('fs'),
	pathExists = require('path-exists'),
	Q = require('q')

assertSuccess = (assert,p) =>{

		p.then( success = () => { 	
					assert.pass("Should success")
					assert.end()	
					},

		failure = () => { 
					assert.fail("Shouldn't be here") 
					assert.end()	
				})
}

assertFailure = (assert,p) => { 
		p.then( success = () => { 	
					assert.fail("should fail")
					assert.end()	
					},

		failure = () => { 
					
					assert.pass("Ok it's failure") 
					assert.end()	
				})
}

test('Test promise with callback success', (assert) => {

   var whoCallAsync = {  f: (callback) => {
		console.log("He calls callback with data") 
		callback(null, "data") 
		}
	}
	

	assertSuccess(assert,p.fromAsync(whoCallAsync.f) )

})


test('Test promise with an exception error ', (assert) => {   
	var whoCallAsync = {  f: (callback) => {
		callback(new Error("a new error occurred", null))
		}
	}
		assertFailure(assert,p.fromAsync(whoCallAsync.f) )
	
})
		


test('Test promise with callback err', (assert) => {

   var whoCallAsync = {  f: (callback) => {
		console.log("He calls callback with err") 
		callback("Error", "some useless data") 
		}
	}
	

	assertFailure(assert,p.fromAsync(whoCallAsync.f) )
})


test('Write a file and read after with p', (assert) => {
		p.fromAsync(fs.writeFile, ['nuovo.txt', 'nuovofile'])
			.then( (data) => {
//				console.log("data:")
//				console.log(data)
				assert.equal(pathExists.sync('nuovo.txt'), true, 
				'should exists a file ') ;
				console.log("now write file")

				try{ 
				p.fromAsync(fs.readFile, ['nuovo.txt', 'utf-8'])
				.then( (data) => {
//					console.log("in data")
//					console.log(data)
					assert.equal(data, 'nuovofile', 'should read a file')
					assert.end()
				},
				(err) => {
					//console.log("in error")
					assert.fail(err)
					assert.end()
				}

				)
				}
				catch(e) {
					console.log("ERROR")
					console.log(e)
				}
	
			}, 
			(err) => {
				console.log("erro")
				console.log(err)
			}) //End first promise
})


test("fromCB with a string parameter" , (assert) => { 
	p.fromAsync(fs.readFile, "nuovo.txt") 
		.then((data) => {
					console.log("data")
					assert.pass("ok")
					assert.end()
		},
		(err) => {
			assert.fail("Error"+err)
			assert.end()
		})
})


test("Simple arithmetic sequence test", (assert) => {
	p.sequence([
		init= () => { return 2+3 }, 
		add= (five) => { return five+5 } ,
		mult= (ten) => { return ten*4 } ,
		(res) => {
			assert.equal(res, 40, "Res should be 40") 
			assert.end()

			}
		])
	})


test("Sequence with fs operations", (assert) => {
	p.sequence([  
			//Write file
			p.fromAsync(fs.writeFile, ["inSeq.txt", "sonoinseq"]),
			//Read file
			() => { return p.fromAsync(fs.readFile, ["inSeq.txt", "utf8"])} ,
		])

		.then( 
			(data) => { 
				assert.equal(data, "sonoinseq","should read the written file")
				assert.end()
			},
			(err) => {
				assert.fail()
				assert.end()
				}
		)

})


test("Convert sync function", (assert) => {
	f = (d1, d2) => {  return d1 +d2}
	p.fromSync(f, [3, 5]) 
		.then(  (data) => {
			assert.equal(data, 8) 
			assert.end()
		},
			(err) => {
			assert.fail(err)
			assert.end()
			}	
		)

})


test("Convert sync that throws exception", (assert) => {
	f = (d1, d2) => {   throw new Error("madness")}
	assertFailure(assert,p.fromSync(f, [3,4]) )
})


test("Mixed seq sync and async", (assert) => { 
	fSync = (d1,d2) => { return d1+d2 } 
	
	p.sequence([
		() => {return p.fromSync(fSync, [2, 3])},
		(data) => {return p.fromAsync(fs.writeFile, ["operations.txt", data])},
		() => {  return p.fromSync(fs.readFileSync, ["operations.txt", "utf8"]) }
		])
		.then( 
		(data) => { 
				assert.equal(data, '5', "should give 5")
				assert.end()
			},

		(err) =>{
				assert.fail("failure") 
				assert.end()
		      })

})




test("Sequence maker simple", (assert) => {
	var makerSeq = p.seqMaker()
	makerSeq
		.addSync(function(d1,d2) { return d1+d2}, [4, 5])
		.addSync(function(data) { return data+5 },[], true)


	makerSeq.start()
		.then( (data) => {
			assert.equal(data, 14, "should do the sync ops")			
			assert.end()

		},

		(err) => {
			assert.fail("failure") 
			assert.end()
		})




})

test("Sequence with write and read ", (assert) => {
	var makerSeq = p.seqMaker()
	makerSeq
		.addSync(function(d1,d2) { return d1+d2}, [4, 5])
		.addSync(fs.writeFileSync, ['toSave.txt'], true)
		.addAsync(fs.readFile, ['toSave.txt', 'utf8'])
		.start()
			.then( (data) => {
				assert.equal(data, '9', "should do the sync ops")			
				assert.end()

			},

			(err) => {
				assert.fail("failure") 
				assert.end()
			})
})


test("With promise", (assert) => {
	f = () => { return Q.fcall(() => { return 10 }) }
	var makerSeq = p.seqMaker() 

	makerSeq
		.addPromise(f)
		.addSync(function(d1,d2, d3) { return d1+d2- d3}, [4,5], true,0)
		.start() 
			.then( (data) => {
				assert.equal(data,9, "should give 9")					
				assert.end()
			},
				(err) => {
				assert.fail("failure") 
				console.log(err)
				assert.end()
			})
})
