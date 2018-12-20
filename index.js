'use strict';

const boom = require('boom');

/**
 * @typedef {Object} Options
 * @property {Boolean} enforceHttps
 * @property {Array} excludePaths
 */

/**
 * @param {Object} server
 * @param {Options} options
 */
exports.plugin = {
    register: (server, options) => {
        if (options.enforceHttps) {
            server.ext('onRequest', function(request, h) {
                const pathIsExcluded = options.excludePaths && options.excludePaths.includes(request.path);
                if (!pathIsExcluded && request.info.protocol !== 'https'
                    && request.raw.req.headers['x-forwarded-proto'] !== 'https') {
                    throw boom.badRequest('HTTPS required');
                }
                return h.continue;
            });
        }
    },
    pkg: require('./package.json')
};
