const debug = require('debug')('yeps:error');
const http = require('http');

module.exports = () => async context => {
    debug('Add error handler');

    context.app.then(async ctx => {
        debug('Register 404 error handler');
        if (!ctx.res.finished) {
            debug('Send 404 error');
            ctx.res.writeHead(404);
            ctx.res.end(http.STATUS_CODES[404]);
        }
    });

    context.app.catch(async (err, ctx) => {
        debug('Register 500 error handler');
        debug(err);
        if (!ctx.res.finished) {
            debug('Send 500 error');
            ctx.res.writeHead(500);
            ctx.res.end(http.STATUS_CODES[500]);
        }
    });
};
