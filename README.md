# YEPS Error Handler


[![NPM](https://nodei.co/npm/yeps-error.png)](https://npmjs.org/package/yeps-error)

[![npm version](https://badge.fury.io/js/yeps-error.svg)](https://badge.fury.io/js/yeps-error)
[![Build Status](https://travis-ci.org/evheniy/yeps-error.svg?branch=master)](https://travis-ci.org/evheniy/yeps-error)
[![Coverage Status](https://coveralls.io/repos/github/evheniy/yeps-error/badge.svg?branch=master)](https://coveralls.io/github/evheniy/yeps-error?branch=master)
[![Linux Build](https://img.shields.io/travis/evheniy/yeps-error/master.svg?label=linux)](https://travis-ci.org/evheniy/)
[![Windows Build](https://img.shields.io/appveyor/ci/evheniy/yeps-error/master.svg?label=windows)](https://ci.appveyor.com/project/evheniy/yeps-error)

[![Dependency Status](https://david-dm.org/evheniy/yeps-error.svg)](https://david-dm.org/evheniy/yeps-error)
[![devDependency Status](https://david-dm.org/evheniy/yeps-error/dev-status.svg)](https://david-dm.org/evheniy/yeps-error#info=devDependencies)
[![NSP Status](https://img.shields.io/badge/NSP%20status-no%20vulnerabilities-green.svg)](https://travis-ci.org/evheniy/yeps-error)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/evheniy/yeps-error/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/evheniy/yeps-error.svg)](https://github.com/evheniy/yeps-error/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/evheniy/yeps-error.svg)](https://github.com/evheniy/yeps-error/network)
[![GitHub issues](https://img.shields.io/github/issues/evheniy/yeps-error.svg)](https://github.com/evheniy/yeps-error/issues)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/evheniy/yeps-error.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)


Simple 404/500 error handler for YEPS app

## Installation

    npm i -S yeps-error
    
## How to use

    const App = require('yeps');
    const app = new App();
    
    const error = require('yeps-error');

    app.all([
        error(),
    ]);
    
Or

    app.then(error());

## JSON request
     
     app.all([
         error({ isJSON: true }),
     ]);
     
## With logger

    const logger = require('yeps-logger');
    
    app.all([
        logger(),
        error({ isJSON: true }),
    ]);
    

## How to make custom error handler

    // create app
    const App = require('yeps');
    const app = new App();
    const Router = require('yeps.router');
    const router = new Router();

    // add middlewares
    app.all([...]);
    
    // add router
    router.catch().then(async ctx => {
        
        ctx.res.statusCode = 200;
        ctx.res.end('Homepage');
        
    });
    
    app.then(router.resolve())

    // 404 error handler
    app.then(async ctx => {
        
        ctx.res.statusCode = 404;
        ctx.res.end('Not Found');
        
    });
    
    // 500 error handler
    app.catch(async (err, ctx) => {
        
        ctx.res.statusCode = 500;
        ctx.res.end('Internal Server Error');
        
    });
    
## Links

* [yeps](https://github.com/evheniy/yeps) - YEPS
* [yeps-benchmark](https://github.com/evheniy/yeps-benchmark) - performance comparison koa2, express and node http
* [yeps-router](https://github.com/evheniy/yeps-router) - YEPS promise based router
* [yeps-redis](https://github.com/evheniy/yeps-redis) - YEPS promise based redis client - ioredis
* [yeps-logger](https://github.com/evheniy/yeps-logger) - YEPS Async logger - winston
* [yeps-boilerplate](https://github.com/evheniy/yeps-boilerplate) - YEPS app boilerplate
* [yeps-express-wrapper](https://github.com/evheniy/yeps-express-wrapper) - YEPS express wrapper
