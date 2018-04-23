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
 * @param {Function} next
 * @returns {Function}
 */
exports.register = function(server, options, next) {
    if (options.enforceHttps) {
        server.ext('onRequest', function(request, reply) {
            const pathIsExcluded = options.excludePaths && options.excludePaths.includes(request.path);
            if (!pathIsExcluded && request.connection.info.protocol !== 'https'
                && request.raw.req.headers['x-forwarded-proto'] !== 'https') {
                return reply(boom.badRequest('HTTPS required'));
            }

            return reply.continue();
        });
    }
    return next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
