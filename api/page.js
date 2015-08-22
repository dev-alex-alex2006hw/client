/**
 * Provides a utility for working with pages of search results.
 * @module planet-client/api/page
 */

var url = require('url');

/**
 * A page of results.  Pages do not need to be constructed directly, but are
 * generated by methods that make API requests.
 * @param {Object} data Data with optional prev and next links.
 * @param {function(Object):Promise} factory Function that creates a promise of
 *     new data given a query object.
 * @constructor
 * @ignore
 */
function Page(data, factory) {
  var links = data.links;

  /**
   * The URL for the previous page (or `undefined`).  Note that you can call
   * [page.prev()](#module:planet-client/api/page~Page#prev) to get the previous
   * page.
   * @type {string}
   */
  this.prevLink = links.prev;

  /**
   * Get the previous page.  If there is no previous page, `prev` will be
   * `null`.
   * @param {Object} options Any request options.
   * @return {Promise.<module:planet-client/api/page~Page>} The previous page.
   * @method
   */
  this.prev = !links.prev ? null : function(options) {
    return factory(url.parse(links.prev, true).query, options);
  };

  /**
   * The URL for the next page (or `undefined`).  Note that you can call
   * [page.next()](#module:planet-client/api/page~Page#next) to get the next
   * page.
   * @type {string}
   */
  this.nextLink = links.next;

  /**
   * Get the next page.  If there is no next page, `next` will be `null`.
   * @param {Object} options Any request options.
   * @return {Promise.<module:planet-client/api/page~Page>} The next page.
   * @method
   */
  this.next = !links.next ? null : function(options) {
    return factory(url.parse(links.next, true).query, options);
  };

  this.data = data;
}

module.exports = Page;
