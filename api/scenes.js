var Pbf = require('pbf');
var geobuf = require('geobuf-published');

/**
 * Provides methods getting scene metadata.
 * @module planet-client/api/scenes
 */

var Page = require('./page');
var request = require('./request');
var urls = require('./urls');
var util = require('./util');

/**
 * Get metadata for a single scene.
 * @param {Object|string} scene An object with scene id and type properties.  If
 *     a string is provided, it is assumed to be the id, and the type will be
 *     set to 'ortho'.
 * @param {Object} options Options.
 * @param {boolean} options.augmentLinks Add API key to links for image
 *     resources in the response.  True by default.
 * @param {function(function())} options.terminator A function that is called
 *     with a function that can be called back to terminate the request.
 * @return {Promise.<Object>} A promise that resolves to scene metadata or is
 *     rejected with any error.
 *     See the [`errors` module](#module:planet-client/api/errors) for a list of
 *     the possible error types.
 */
function get(scene, options) {
  options = options || {};
  if (typeof scene === 'string') {
    scene = {
      id: scene,
      type: 'ortho'
    };
  }
  var config = {
    url: urls.join(urls.SCENES, scene.type, scene.id),
    terminator: options.terminator
  };
  return request.get(config).then(function(res) {
    if (options.augmentLinks !== false) {
      util.augmentSceneLinks(res.body);
    }
    return res.body;
  });
}

/**
 * Get a collection of scene metadata based on a query.
 * @param {Object} query A query object.
 * @param {Object} options Options.
 * @param {boolean} options.augmentLinks Add API key to links for image
 *     resources in the response.  True by default.
 * @param {function(function())} options.terminator A function that is called
 *     with a function that can be called back to terminate the request.
 * @param {boolean} options.geobuf Return data as a geobuf encoded protocol
 *     buffer instead of GeoJSON.
 * @return {Promise.<module:planet-client/api/page~Page>} A promise that
 *     resolves to a page of scene metadata or is rejected with any error.
 *     See the [`errors` module](#module:planet-client/api/errors) for a list of
 *     the possible error types.
 */
function search(query, options) {
  options = options || {};
  var type;
  if (query.type) {
    type = query.type;
    delete query.type;
  } else {
    type = 'ortho';
  }

  if (options.geobuf) {
    query.format = 'geobuf';
  }

  var config = {
    url: urls.join(urls.SCENES, type, ''),
    query: query,
    terminator: options.terminator
  };
  return request.get(config).then(function(res) {
    // TODO: remove augmentLinks support
    if (!options.geobuf && options.augmentLinks !== false) {
      var scenes = res.body.features;
      for (var i = 0, ii = scenes.length; i < ii; ++i) {
        util.augmentSceneLinks(scenes[i]);
      }
    }
    if (options.geobuf) {
      var headers = res.response.headers;
      if (headers['content-type'] === 'application/json') {
        var buffer = geobuf.encode(res.body, new Pbf());
        buffer.links = res.body.links;
        res.body = buffer;
      } else {
        res.body.links = util.parseLinksHeader(headers.links);
      }
    }
    return new Page(res.body, search);
  });
}

exports.search = search;
exports.get = get;
