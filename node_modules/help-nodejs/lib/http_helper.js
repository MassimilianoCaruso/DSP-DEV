const errors = require('errors'),
	_ = require('underscore')


const httpCodes = {
     BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      PAYMENT_REQUIRED: 402,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      METHOD_NOT_ALLOWED: 405,
      NOT_ACCEPTABLE: 406,
      PROXY_AUTHENTICATION_REQUIRED: 407,
      REQUEST_TIMEOUT: 408,
      CONFLICT: 409,
      GONE: 410,
      LENGTH_REQUIRED: 411,
      PRECONDITION_FAILED: 412,
      PAYLOAD_TOO_LARGE: 413,
      URI_TOO_LONG: 414,
      UNSUPPORTED_MEDIA_TYPE: 415,
      RANGE_NOT_SATISFIABLE: 416,
      EXPECTATION_FAILED: 417,
      IM_A_TEAPOT: 418,
      MISDIRECTED_REQUEST: 421,
      UNPROCESSABLE_ENTITY: 422,
      LOCKED: 423,
      FAILED_DEPENDENCY: 424,
      UNORDERED_COLLECTION: 425,
      UPGRADE_REQUIRED: 426,
      PRECONDITION_REQUIRED: 428,
      TOO_MANY_REQUESTS: 429,
      REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
      UNAVAILABLE_FOR_LEGAL_REASONS: 451,
      INTERNAL_SERVER_ERROR: 500,
      NOT_IMPLEMENTED: 501,
      BAD_GATEWAY: 502,
      SERVICE_UNAVAILABLE: 503,
      GATEWAY_TIMEOUT: 504,
      HTTP_VERSION_NOT_SUPPORTED: 505,
      VARIANT_ALSO_NEGOTIATES: 506,
      INSUFFICIENT_STORAGE: 507,
      LOOP_DETECTED: 508,
      BANDWIDTH_LIMIT_EXCEEDED: 509,
      NOT_EXTENDED: 510,
      NETWORK_AUTHENTICATION_REQUIRED: 511 }


var errToMap = [];

function _send_success(res, data) {

    res.writeHead(200, {"Content-Type": "application/json"});
    var output = { error: null, data: data };
    res.end(JSON.stringify(output) + "\n");
}
	
function _send_failure (res, server_code, err) {
	    var code = (err.code) ? err.code : err.name;
	    res.writeHead(server_code, { "Content-Type" : "application/json" }); 
	    res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
	}

function _noHttpCode(code) {
		return !_.contains(_.values(httpCodes), code);
}


//TODO
function http_code_for_error (err) {
	var mappedError;
	//Find mapped error
	_.each(errToMap, (e)  =>{
		if(err.message === e.err.message)	
			mappedError = e
	})	
    if(mappedError && mappedError.code) 
	return mappedError.code
	else 
	    //Default service unavailable
	    return 503;
}

//Register an array of names in httpErr 
function _register(name, httpErr, err) {
	errors.mapper(errNames, function () { return httpErr}) 

}

module.exports = {

	response : function response(res, err, results, logging) {
        if(err)
	{
                if(logging) {
                  console.log("ERROR:");
                  console.log(err);
                }
                _send_failure(res, http_code_for_error(err), err);
	}
        else 
                _send_success(res, results );
	},

	http_code_for_error : http_code_for_error, 
	
	//Regiser an error code
	register(error, code) {
		
		//Default : internal server code 
		if( _noHttpCode(code) )
			throw new Error("WRONG HTTP CODE")
		if(!(error instanceof Error))
		{
			throw new Error("NO ERROR IN REGISTER") ;
		}
		else {
			errToMap.push({err:error, code:code}) 
		
		}

	}
};
