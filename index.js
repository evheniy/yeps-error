const debug = require('debug')('yeps:error');
const http = require('http');

module.exports = ({ isJSON = false, hasUserError = true, hasServerError = true } = {}) => async context => {

    debug('Add error handler');

    if (isJSON) {

        debug('Content-Type: application/json');

        context.res.setHeader('Content-Type', 'application/json');
    }

    if (hasUserError) {
        debug('Register 404 error handler');

        context.app.then(async ctx => {

            if (!ctx.res.finished) {

                debug('Send 404 error');

                if (ctx.logger) {
                    ctx.logger.error(`Not Found (404) url: ${ctx.req.url}`);
                }

                ctx.res.statusCode = 404;

                if (isJSON) {
                    ctx.res.end(JSON.stringify({ message: 'Not Found' }));
                } else {
                    ctx.res.end(http.STATUS_CODES[404]);
                }
            }
        });
    }

    if (hasServerError) {
        debug('Register 500 error handler');

        context.app.catch(async (err, ctx) => {

            if (err) {

                debug(err);

                if (ctx.logger) {
                    ctx.logger.error(err);
                }

                if (!ctx.res.finished) {

                    ctx.res.statusCode = 500;

                    if (isJSON) {
                        ctx.res.end(JSON.stringify({
                            message: err.message || http.STATUS_CODES[500]
                        }));
                    } else {
                        ctx.res.end(http.STATUS_CODES[500]);
                    }
                }
            }

        });
    }
};
