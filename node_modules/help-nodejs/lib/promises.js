const Q = require('q') 
const SYNC = 'sync', ASYNC = 'async', PROMISE= 'promise'


function _cleanArray(args) {

		if(!args) 
		args = []
		else if(! Array.isArray(args)) 	
			args = [args]
		var args =  args || [];
return args

}

//Add argument result of previous if previous is setted
function _getArgs(ele, data) {
	if(ele.previous) 
		if(typeof ele.argPos === 'number' && ele.argPos >= 0 && ele.argPos < ele.args.length)
			ele.args.splice(ele.argPos, 0, data);
		else ele.args.push(data)

}
function _manageFunction(p, ele) {
	switch(ele.type)  {
		case SYNC : 
			return (data) => { 
					var args = _getArgs(ele,data)
					return p.fromSync(ele.func, ele.args) 
					}  
			break
		case ASYNC: 
			return (data) => {
					var args = _getArgs(ele,data)
					return p.fromAsync(ele.func, ele.args) 
					}  
			break
		case PROMISE: 
			return (data) => {
					var args = _getArgs(ele, data)
					return  ele.func.apply(this,args)
					}
			break  

		default: throw new Error("NO CORRECT TYPE VALUE")
		}
}


module.exports = {
	//Execute a sequence of functions
	sequence(funcs, firstArg) {
		 return funcs.reduce(Q.when, Q(firstArg))
	},
	seqMaker () {
		var fs = []
		var self = this
		return {
			//TODO : check arguments
			addSync(f, args, previous, argPos) { 
				fs.push({func:f, args:args, previous:previous, argPos:argPos, type: SYNC}) 
				return this
				},
			addAsync(f, args,previous, argPos) {  
				fs.push({func:f, args:args, previous:previous,argPos:argPos, type: ASYNC})  
				return this
				} ,
			addPromise(f, args, previous, argPos) { 
				fs.push({func:f, args:args, previous:previous, argPos:argPos, type: PROMISE}) 
				return this
				},
			start(firstArg) { 
				var funcs= []
				fs.forEach(function(ele) {
					funcs.push(_manageFunction(self,ele))
				})
				
				return self.sequence(funcs, firstArg)
			}


		}

	},
	manage(deferred, err, data) {
		if(err) 
			deferred.reject(new Error(err))
	
		else deferred.resolve(data) 

	},
	fromSync(f, args) {
		var args = _cleanArray(args)
		var deferred = Q.defer() 
		try { 

		  var ret = f.apply(null, args)	
		  deferred.resolve(ret)
		 return deferred.promise
		}
		catch(err) {
		   deferred.reject(err) 
		 return  deferred.promise
		}

	},
	fromAsync(f, args ) {
		var deferred = Q.defer() 
		try { 
		var args = _cleanArray(args)
		var callback = (err, data) => {
		if(err) 
		{
			if(typeof err === 'error')
			{
				deferred.reject(err) 
				//reject(err) 
			}
			else 
			{
				deferred.reject(new Error(err))
				//reject(new Error(err))
			}
		}
		else 
			deferred.resolve(data) 
	
	}

		args.push(callback)

		f.apply(null, args) 
		return deferred.promise
		}
		catch(e) 
		{
			deferred.reject(e)
			return deferred.promise
		}
		//push the last on callback
}
}


