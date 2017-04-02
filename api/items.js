/**
 * Provides methods to get information on items.
 * @module planet-client/api/items
 */

var pager = require('./pager');
var request = require('./request');
var urls = require('./urls');

/**
 * Get metadata for a single item.
 * @param {string} type An item type identifier.
 * @param {string} id An item identifier.
 * @param {Object} options Options.
 * @param {function(function())} options.terminator A function that is called
 *     with a function that can be called back to terminate the request.
 * @return {Promise.<Object>} A promise that resolves to item metadata or
 *     is rejected with any error.  See the [`errors`
 *     module](#module:planet-client/api/errors) for a list of the possible
 *     error types.
 */
function get(type, id, options) {
  options = options || {};
  var config = {
    url: urls.items(type, id),
    terminator: options.terminator
  };
  return request.get(config).then(function(res) {
    return res.body;
  });
}

/**
 * Get metadata for multiple items.
 * @param {Object} options Options.
 * @param {Array<string>} options.types A list of item type identifiers.
 * @param {Object} options.filter A filter object for the search.
 * @param {string} options.id A saved search identifier.  This can be provided
 *     as an alternative to `itemTypes` and `filter` to get items from a
 *     previously saved search.
 * @param {Object} options.query An object with optional `_page_size` and
 *     `sort` parameters.
 * @param {function(Array)} options.each A function that is called once for
 *     each page of data.  If the `each` callback is absent, all data will be
 *     concatenated and provided when the promise resolves.
 * @param {function(function())} options.terminator A function that is called
 *     with a function that can be called back to terminate the request.
 * @return {Promise<Array>} A promise that resolves when all data is finished
 *     loading or is rejected with any error.  If an `each` callback is not
 *     provided, the promise will resolve with all data concatenated.
 *     See the [`errors` module](#module:planet-client/api/errors) for a list of
 *     the possible error types.
 */
function search(options) {
  options = options || {};
  var config = {
    query: options.query,
    terminator: options.terminator
  };
  if (options.filter && options.types) {
    config.url = urls.quickSearch();
    config.method = 'POST';
    config.body = {
      filter: options.filter,
      item_types: options.types
    };
  } else if (options.id) {
    config.url = urls.searches(options.id, 'results');
  } else {
    throw new Error('Expected both `filter` and `itemTypes` or a serach `id`.');
  }
  return pager(config, 'features', options.each);
}

exports.search = search;
exports.get = get;