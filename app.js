'use strict';

const restify = require('restify');
const fs = require('fs');

const server = restify.createServer();

server.get(/.*/, restify.serveStatic({
  'directory': 'live-transpile',
  'default': 'index.html'
}));

server.listen(8081, function() {
  console.log('%s listening at %s', server.name, server.url);
});

