const App = require('yeps');
const error = require('..');
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const expect = chai.expect;

chai.use(chaiHttp);
let app;

describe('YAPS error handler test', () => {

    beforeEach(() => {
        app = new App();
    });

    it('should test app.then', async() => {

        let isTestFinished = false;

        app.then(error());
        app.then(async() => {
            throw new Error('test');
        });

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                expect(err.message).to.be.equal('Internal Server Error');
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test app.all', async() => {

        let isTestFinished = false;

        app.all([error()]);
        app.then(async() => {
            throw new Error('test');
        });

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                expect(err.message).to.be.equal('Internal Server Error');
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test without error', async() => {

        let isTestFinished = false;

        app.then(error());
        app.then(async ctx => {
            ctx.res.writeHead(200);
            ctx.res.end('');
        });
        app.then(async() => {
            throw new Error('test');
        });

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .send()
            .then(res => {
                expect(res).to.have.status(200);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

});
