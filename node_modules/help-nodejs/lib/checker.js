var data = require('./data'),
 	stampit = require('stampit'),
	Joi = require('joi'), 
	errors = require('errors')


const Objects = data.Objects,

Checker = stampit() 
	.init(function() {
		this.objects = Objects((e) => {

			if(e.name && e.conditionFn && e.error && typeof e.name === 'string' && typeof e.conditionFn  === 'function' && e.error instanceof Error ) return true
			else return false
		});

	this.objects.setOptions(	
		{
			exception :{ 
				    add: true, 
				    uniq: true
				}
		})

	})
	.methods({
			load(name, conditionFn, error) {

				this.objects.add({name:name, 
						conditionFn: conditionFn,
						error: error
						})
			},
			check(arg, cname, callback) {

				var condition = this.objects.get({name:cname})
				if(condition === null) 
					if(callback && typeof callback === 'function') {
						callback(new Error("Condition not registered"))
					}	
					else {
						throw new Error("Condition not registered")
					}	
				else { 
					var test = condition.conditionFn(arg)	
					if(callback && typeof callback === 'function') 
					{
						if(!test)	
							callback(condition.error)
						else callback(null)
					}
					else {
						if(!test) 	
							throw condition.error
					}
				}
			},
				
			
	})

					
JoiChecker = stampit() 
	.init(function() {
		this.objects = Objects((e) => {

			if(e.name && e.joiSchema && typeof e.name === 'string' &&
				e.joiSchema.isJoi ) 
			return true
			else return false
		});

	this.objects.setOptions(	
		{
			exception :{ 
				    add: true, 
				    uniq: true
				}
		})

	})
	.methods({
			load(name, joiSchema, error) {

				this.objects.add({
 						name:name, 
						joiSchema: joiSchema,
						error:error
						})
				//Correct joiSchema sended after add set error
				{

				}
			
			},
			check(arg, cname, callback) {

				var condition = this.objects.get({name:cname})
				if(condition === null) 
					if(callback && typeof callback === 'function') {
						callback(new Error("Condition not registered"))
					}	
					else {
						throw new Error("Condition not registered")
					}	
				else { 
					var schema = condition.joiSchema
					//Change schema
					if(condition.error && condition.error instanceof Error) 
					{
						schema = schema.error(condition.error)//To test
					}


					if(callback && typeof callback === 'function') 
					{
						Joi.validate(arg, schema, callback)
					}
					else {
						Joi.assert(arg, schema)
					}
				}
			},
})

AppErrors = stampit() 
		.init(function() {

			this.objects = Objects((e) => {
				if(e && e.name && typeof e.name === 'string' && e.error && e.error instanceof Error) 
					return true
				else return false
			} )
			this.objects.setOptions({ exception:{add:true, uniq:true}})

			this.add = (name, error) => {
				try {
					this.objects.add({name:name, error:error})
					console.log(this.objects.options)
				}

				catch(e) { 
					throw new Error("No correct error type loaded")	
				} 
			}

			})



module.exports = { 
	Checker : Checker,
	JoiChecker : JoiChecker,
	AppErrors : AppErrors
}
