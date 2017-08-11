# Hapi Enforce HTTPS Plugin [![Build Status](https://travis-ci.org/plan3/hapi-enforce-https.svg?branch=master)](https://travis-ci.org/plan3/hapi-enforce-https)

Hapi plugin which forces to use HTTPS protocol in selected endpoints.

It's responsible for blocking not secured incoming requests to the resources.
All requests which aren't via HTTPS will return a `Bad request` error (400).
This plugin isn't for redirecting from not secured resources to secured ones.
There's already [a plugin for that](https://www.npmjs.com/package/hapi-require-https).


## Installtion

`npm install hapi-enforce-https`


## Usage

```js
const Hapi = require('hapi');
const server = new Hapi.Server();
const enforceHttps = require('@plan3-relate/hapi-enforce-https');


// register the plugin 
server.register({
  register: enforceHttps,
  options: {
    enforceHttps: true
  }
});
```
