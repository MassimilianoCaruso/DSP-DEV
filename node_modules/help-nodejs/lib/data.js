const stampit = require('stampit'),
	_ = require('underscore')


//Array of uniq object instance
const Objects = stampit().init( function(condition)  {
	var cond = () => {return true} 
	var data = [];

	if(condition && typeof condition === 'function' ) 
		cond = condition
	this.options  = { exception:{add:false, uniq:false} }

	this.addAll = (arr, options) => {
		_.each(arr, (e) => { 
			this.add(e,options) 
			})
	}	
	this.setCondition = (condition) => {
		//If set condition 
		if(condition && typeof condition === 'function' ) 
			cond = condition
	}
	this.setOptions = (options) => {
	this.options = 	_.extend({},  this.options, options)
	}
	this.add = (e, options) =>  {

		this.options = _.extend({}, options, this.options)
	

		if(cond(e))
		{
			//If already exists
			if(this.get(e))
			{
				console.log("Esiste già")
				console.log(this.options)
				//Is silent?
				if(this.options.exception.uniq)
					throw new Error("No uniq") 
				else return 
			}
				
			data.push(e)
		}
		else 
		{
			if(this.options.exception.add)
				throw new Error("Condition not satisfied")
			else 
				return 
		}
	}

	this.get = (e) => {


		var ret = []
			//If id it's defined
			if(ret.length === 0 && e.id) 
			{  	
				ret = _.where(data, {id : e.id})
			}
			//Find by name if no id
			else if(ret.length === 0 && e.name) 
			{
				ret = _.where(data, {name : e.name})
			}

			else {
				_.each(_.keys(e), (arg) => { 
					ret = _.where(data, {[arg] : e[arg]})	
					if(ret)	
						return  ret
				})

			}


			if(ret.length === 1)
				return ret[0]
			else if (ret.length === 0)
				return null
			else return ret

	}
	this.all = () => { return data } 

})

module.exports = { 
			//Return instantiation
			Objects : Objects

}
