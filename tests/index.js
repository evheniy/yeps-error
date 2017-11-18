const App = require('yeps');
const error = require('..');
const chai = require('chai');
const chaiHttp = require('chai-http');
const srv = require('yeps-server');

const { expect } = chai;

chai.use(chaiHttp);
let app;
let server;

describe('YEPS error handler test', () => {
  beforeEach(() => {
    app = new App();
    server = srv.createHttpServer(app);
  });

  afterEach(() => {
    server.close();
  });

  it('should test 404 error handler', async () => {
    let isTestFinished = false;

    app.then(error());

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
        expect(err.message).to.be.equal('Not Found');
        expect(err.response.text).to.be.equal('Not Found');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 404 error handler with logger', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(error());

    app.then(async (ctx) => {
      ctx.logger = {
        error(text) {
          expect(text).to.be.equal('Not Found (404) url: /');
          isTestFinished1 = true;
        },
      };
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
        expect(err.message).to.be.equal('Not Found');
        expect(err.response.text).to.be.equal('Not Found');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test disabled 404 error handler', async () => {
    let isTestFinished = false;

    app.then(error({ hasUserError: false }));

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    await chai.request(server)
      .get('/404')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 404 error handler json', async () => {
    let isTestFinished = false;

    app.then(error({ isJSON: true }));

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
        expect(err.message).to.be.equal('Not Found');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('Not Found');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 404 error handler without error', async () => {
    let isTestFinished = false;

    app.then(error());

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
      return Promise.reject();
    });

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 404 error handler without error json', async () => {
    let isTestFinished = false;

    app.then(error({ isJSON: true }));

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
      return Promise.reject();
    });

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.type).to.be.equal('application/json');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 404 error handler with 3 requests', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;
    let isTestFinished3 = false;

    app.then(error());

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
        expect(err.message).to.be.equal('Not Found');
        expect(err.response.text).to.be.equal('Not Found');
        isTestFinished1 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
        expect(err.message).to.be.equal('Not Found');
        expect(err.response.text).to.be.equal('Not Found');
        isTestFinished2 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
        expect(err.message).to.be.equal('Not Found');
        expect(err.response.text).to.be.equal('Not Found');
        isTestFinished3 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
    expect(isTestFinished3).is.true;
  });

  it('should test 404 error handler with 3 requests json', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;
    let isTestFinished3 = false;

    app.then(error({ isJSON: true }));

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
        expect(err.message).to.be.equal('Not Found');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('Not Found');
        isTestFinished1 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
        expect(err.message).to.be.equal('Not Found');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('Not Found');
        isTestFinished2 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
        expect(err.message).to.be.equal('Not Found');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('Not Found');
        isTestFinished3 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
    expect(isTestFinished3).is.true;
  });


  it('should test 500 error handler with app.then', async () => {
    let isTestFinished = false;

    app.then(error());

    app.then(async () => {
      throw new Error('test');
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 500 error handler with app.then with logger', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(error());

    app.then(async (ctx) => {
      ctx.logger = {
        error(err) {
          expect(err.message).to.be.equal('test');
          isTestFinished1 = true;
        },
      };
    });

    app.then(async () => {
      throw new Error('test');
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test disabled 500 error handler with app.then', async () => {
    let isTestFinished = false;

    app.then(error({ hasServerError: false }));

    app.then(async () => {
      throw new Error('test');
    });

    app.catch(async (err, ctx) => {
      ctx.res.statusCode = 500;
      ctx.res.end(err.message);
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 500 error handler with app.then with logger without text', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(error());

    app.then(async (ctx) => {
      ctx.logger = {
        error(err) {
          expect(err.message).to.be.equal('');
          isTestFinished1 = true;
        },
      };
    });

    app.then(async () => {
      throw new Error();
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test 500 error handler with app.then json', async () => {
    let isTestFinished = false;

    app.then(error({ isJSON: true }));

    app.then(async () => {
      throw new Error('test');
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('test');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 500 error handler with app.then json without message', async () => {
    let isTestFinished = false;

    app.then(error({ isJSON: true }));

    app.then(async () => {
      throw new Error();
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('Internal Server Error');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 500 error handler with app.all', async () => {
    let isTestFinished = false;

    app.all([error()]);

    app.then(async () => {
      throw new Error('test');
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 500 error handler with app.all json', async () => {
    let isTestFinished = false;

    app.all([
      error({ isJSON: true }),
    ]);

    app.then(async () => {
      throw new Error('test');
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('test');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 500 error handler with app.all json without message', async () => {
    let isTestFinished = false;

    app.all([
      error({ isJSON: true }),
    ]);

    app.then(async () => {
      throw new Error();
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('Internal Server Error');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 500 error handler without error', async () => {
    let isTestFinished = false;

    app.then(error());

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });
    app.then(async () => {
      throw new Error('test');
    });

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 500 error handler without error json', async () => {
    let isTestFinished = false;

    app.then(error({ isJSON: true }));

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(async () => {
      throw new Error('test');
    });

    await chai.request(server)
      .get('/')
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.type).to.be.equal('application/json');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test 500 error handler with app.then with 3 requests', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;
    let isTestFinished3 = false;

    app.then(error());

    app.then(async () => {
      throw new Error('test');
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        isTestFinished1 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        isTestFinished2 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        isTestFinished3 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
    expect(isTestFinished3).is.true;
  });

  it('should test 500 error handler with app.then with 3 requests json', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;
    let isTestFinished3 = false;

    app.then(error({ isJSON: true }));

    app.then(async () => {
      throw new Error('test');
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('test');
        isTestFinished1 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('test');
        isTestFinished2 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('test');
        isTestFinished3 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
    expect(isTestFinished3).is.true;
  });

  it('should test 500 error handler with app.then with 3 requests json without message', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;
    let isTestFinished3 = false;

    app.then(error({ isJSON: true }));

    app.then(async () => {
      throw new Error();
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('Internal Server Error');
        isTestFinished1 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('Internal Server Error');
        isTestFinished2 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('Internal Server Error');
        isTestFinished3 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
    expect(isTestFinished3).is.true;
  });

  it('should test 500 error handler with app.all with 3 requests', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;
    let isTestFinished3 = false;

    app.all([
      error(),
    ]);

    app.then(async () => {
      throw new Error('test');
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        isTestFinished1 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        isTestFinished2 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        isTestFinished3 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
    expect(isTestFinished3).is.true;
  });

  it('should test 500 error handler with app.all with 3 requests json', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;
    let isTestFinished3 = false;

    app.all([
      error({ isJSON: true }),
    ]);

    app.then(async () => {
      throw new Error('test');
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('test');
        isTestFinished1 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('test');
        isTestFinished2 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('test');
        isTestFinished3 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
    expect(isTestFinished3).is.true;
  });

  it('should test 500 error handler with app.all with 3 requests json without message', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;
    let isTestFinished3 = false;

    app.all([
      error({ isJSON: true }),
    ]);

    app.then(async () => {
      throw new Error();
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('Internal Server Error');
        isTestFinished1 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('Internal Server Error');
        isTestFinished2 = true;
      });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(500);
        expect(err.message).to.be.equal('Internal Server Error');
        expect(err.response.type).to.be.equal('application/json');
        expect(err.response.body).is.a('object');
        expect(err.response.body).to.have.property('message');
        expect(err.response.body.message).is.not.undefined;
        expect(err.response.body.message).to.be.equal('Internal Server Error');
        isTestFinished3 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
    expect(isTestFinished3).is.true;
  });

  it('should test error code', async () => {
    let isTestFinished = false;

    app.then(error());

    app.then(async () => {
      const err = new Error();
      err.code = 403;

      return Promise.reject(err);
    });

    await chai.request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(403);
        expect(err.message).to.be.equal('Forbidden');
        expect(err.response.text).to.be.equal('Forbidden');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });
});
