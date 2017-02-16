const debug = require('debug')('yeps:error');

module.exports = () => async context => {
    debug('Add error handler');

    context.app.catch(async (err, ctx) => {
        debug('Register 500 error handler');
        debug(err);
        if (!ctx.res.finished) {
            debug('Send 500 error handler');
            ctx.res.writeHead(500);
            ctx.res.end('Internal Server Error');
        }
    });

    /* context.app.resolve = () => {
        debug('Update resolve');
        context.app.then(ctx => {
            debug('Register 404 error handler');
            if (!ctx.res.finished) {
                debug('Send 404 error handler');
                ctx.res.writeHead(404);
                ctx.res.end('Not Found');
            }
        });
        debug('Old resolve');
        return context.app.resolve();
    };*/
};
