/**
 * Includes specific `Error` types generated by API requests.  When a request
 * method returns a promise that is rejected, you can use `instanceof` to
 * determine what type of error you have.
 *
 * @module planet-client/api/errors
 */

/**
 * The base class for all response errors.
 * @param {string} message Error message.
 * @param {XMLHttpRequest} response The response.
 * @param {string} body Any parsed response body.
 * @constructor
 * @ignore
 */
function ResponseError(message, response, body) {

  /**
   * A message providing details about the error.
   * @type {string}
   */
  this.message = message;

  /**
   * The server response.
   * @type {IncomingMessage}
   */
  this.response = response;

  /**
   * Any parsed response body.  For "expected" errors, this will be an object
   * representing the JSON response body.
   * @type {Object}
   */
  this.body = body;

  /**
   * The stack trace for the error.
   * @type {string}
   */
  this.stack = (new Error()).stack;

}
ResponseError.prototype = new Error();
ResponseError.prototype.name = 'ResponseError';

/**
 * The request was bad (status `400`).
 * @param {string} message Error message.
 * @param {XMLHttpRequest} response The response.
 * @param {Object} body Any parsed response body (as JSON).
 * @extends {module:planet-client/api/errors~ResponseError}
 * @constructor
 * @ignore
 */
function BadRequest(message, response, body) {
  ResponseError.apply(this, arguments);
}

BadRequest.prototype = new ResponseError();
BadRequest.prototype.name = 'BadRequest';

/**
 * The request requires user authentication (status `401`).
 * @param {string} message Error message.
 * @param {XMLHttpRequest} response The response.
 * @param {Object} body Any parsed response body (as JSON).
 * @extends {module:planet-client/api/errors~ResponseError}
 * @constructor
 * @ignore
 */
function Unauthorized(message, response, body) {
  ResponseError.apply(this, arguments);
}

Unauthorized.prototype = new ResponseError();
Unauthorized.prototype.name = 'Unauthorized';

/**
 * The client is forbidden from making the request (status `403`).
 * @param {string} message Error message.
 * @param {XMLHttpRequest} response The response.
 * @param {Object} body Any parsed response body (as JSON).
 * @extends {module:planet-client/api/errors~ResponseError}
 * @constructor
 * @ignore
 */
function Forbidden(message, response, body) {
  ResponseError.apply(this, arguments);
}

Forbidden.prototype = new ResponseError();
Forbidden.prototype.name = 'Forbidden';

/**
 * The API returns an unexpected response.
 * @param {string} message Error message.
 * @param {XMLHttpRequest} response The response.
 * @param {string} body Any parsed response body.
 * @extends {module:planet-client/api/errors~ResponseError}
 * @constructor
 * @ignore
 */
function UnexpectedResponse(message, response, body) {
  ResponseError.apply(this, arguments);
}

UnexpectedResponse.prototype = new ResponseError();
UnexpectedResponse.prototype.name = 'UnexpectedResponse';

/**
 * An error generated when the request is terminated.
 * @param {string} message Error message.
 * @constructor
 * @ignore
 */
function AbortedRequest(message) {
  this.message = message;
  this.stack = (new Error()).stack;
}
AbortedRequest.prototype = new Error();
AbortedRequest.prototype.name = 'AbortedRequest';

exports.ResponseError = ResponseError;
exports.BadRequest = BadRequest;
exports.Unauthorized = Unauthorized;
exports.Forbidden = Forbidden;
exports.UnexpectedResponse = UnexpectedResponse;
exports.AbortedRequest = AbortedRequest;