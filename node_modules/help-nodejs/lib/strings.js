//insert for numOcc if numOcc 0 then only last 
function _insert(str, after, value, numOcc) {
	var index = 0
	//Default only one
	if(typeof(numOcc) === "undefined" || numOcc < 0 )
		numOcc =  1

		//Only last
		if(numOcc === 0) 
		{
				index =  str.lastIndexOf(after) + after.length
				return str.substr(0, index) + value + str.substr(index);
		}

		else { 
		
			for(var i = 0 ; i < numOcc ; i++) 
			{
				index =  str.indexOf(after, index) + after.length	
				str  = str.substr(0, index) + value + str.substr(index);
				//in order to avoid the repeated same word
				index +=after.length + 2
			}
			return str
		}

}


module.exports = {  

		/** Function that count occurrences of a substring in a string;
	 * @param {String} string               The string
	 * @param {String} subString            The sub string to search for
	 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
	 *
	 * @author Vitim.us https://gist.github.com/victornpb/7736865
	 * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
	 * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
	 */
	occurrences(string, subString, allowOverlapping) {

	    string += "";
	    subString += "";
	    if (subString.length <= 0) return (string.length + 1);

	    var n = 0,
		pos = 0,
		step = allowOverlapping ? 1 : subString.length;

	    while (true) {
		pos = string.indexOf(subString, pos);
		if (pos >= 0) {
		    ++n;
		    pos += step;
		} else break;
	    }
	    return n;
	},
	//substring between two characters
	substring(str, first, second) {

		//Without regex
		if(str.indexOf(first) === -1) 
			return ""
		else { 
			var fI = str.indexOf(first)  +  first.length 
			str = str.substring(fI, str.length)
			if(second) 
			{
				fS = str.lastIndexOf(second)
				//If don't find second character returns empty string
				if(fS === -1) 
				str = ''
				else str = str.substring(0, fS)	
			}


			return str

		}


	},
	//Add a string after the first occurrence of after ( if null prepend to the string) 
	add(str, toAdd, after, global) {
		if(!after)	
			return toAdd+str
	
		else if(!global) {
				str = _insert(str, after, toAdd, 1)	
		}
		//Global occurrences
		else  {

			var numTimes = this.occurrences(str, after)  
			//Last occurrence
			str = _insert(str, after, toAdd, numTimes)
		}


		return str
		
	},

	//Remove a string
	remove(str, toRemove, global) {

		var re = new RegExp(toRemove, 'g')
		return (global)? str.replace(re,  ""): str.replace(toRemove, '')		

	}


}
