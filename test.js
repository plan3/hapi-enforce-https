'use strict';

const should = require('chai').should();
const hapi = require('hapi');
const plugin = require('.');

describe('Hapi Enforce HTTPS Plugin tests', function() {
    [{
        expect: (err) => should.not.exist(err, 'Error should be present')
    },
    {
        options: { enforceHttps: true },
        expect: (err) => should.not.exist(err, 'Error should be present')
    },
    {
        options: { enforceHttps: false },
        expect: (err) => should.not.exist(err, 'Error should be present')
    }].forEach((dataSet, i) => {
        it(`required valid input as a configuration object #${i}`, function() {
            const server = new hapi.Server();
            server.connection();
            return server.register({register: plugin, options: dataSet.options})
                .then(dataSet.expect);
        });
    });

    [{
        options: { enforceHttps: false },
        headers: { 'x-forwarded-proto': 'http' },
        expect: (response) => {
            should.equal(response.statusCode, 200);
            should.equal(response.result, 'Hello!');
        }
    }, {
        options: { enforceHttps: true },
        headers: { 'x-forwarded-proto': 'http' },
        expect: (response) => {
            should.equal(response.statusCode, 400);
            should.equal(response.result.error, 'Bad Request');
            should.equal(response.result.message, 'HTTPS required');
        }
    }, {
        options: { enforceHttps: false },
        headers: { 'x-forwarded-proto': 'https' },
        expect: (response) => {
            should.equal(response.statusCode, 200);
            should.equal(response.result, 'Hello!');
        }
    }, {
        options: { enforceHttps: true },
        headers: { 'x-forwarded-proto': 'https' },
        expect: (response) => {
            should.equal(response.statusCode, 200);
            should.equal(response.result, 'Hello!');
        }
    }].forEach((dataSet, i) => {
        it(`allows or blocks the resource depending on a given configuration #${i}`, function() {
            const server = new hapi.Server();
            server.connection();
            server.register({ register: plugin, options: dataSet.options });
            server.route({ method: 'GET', path: '/', handler: (request, reply) => reply('Hello!') });
            return server.inject({ url: '/', headers: dataSet.headers })
                .then(dataSet.expect);
        });
    });
});
