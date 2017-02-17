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

    it('should test 404 error handler', async() => {

        let isTestFinished = false;

        app.then(error());

        await chai.request(http.createServer(app.resolve()))
            .get('/')
            .send()
            .catch(err => {
                expect(err).to.have.status(404);
                expect(err.message).to.be.equal('Not Found');
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test 404 error handler without error', async() => {

        let isTestFinished = false;

        app.then(error());
        app.then(async ctx => {
            ctx.res.writeHead(200);
            ctx.res.end('');
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

    it('should test 404 error handler with 3 requests', async() => {

        let isTestFinished1 = false;
        let isTestFinished2 = false;
        let isTestFinished3 = false;

        app.then(error());

        const server = http.createServer(app.resolve());
        await chai.request(server)
            .get('/')
            .send()
            .catch(err => {
                expect(err).to.have.status(404);
                expect(err.message).to.be.equal('Not Found');
                isTestFinished1 = true;
            });
        await chai.request(server)
            .get('/')
            .send()
            .catch(err => {
                expect(err).to.have.status(404);
                expect(err.message).to.be.equal('Not Found');
                isTestFinished2 = true;
            });
        await chai.request(server)
            .get('/')
            .send()
            .catch(err => {
                expect(err).to.have.status(404);
                expect(err.message).to.be.equal('Not Found');
                isTestFinished3 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
        expect(isTestFinished3).is.true;
    });


    it('should test 500 error handler with app.then', async() => {

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

    it('should test 500 error handler with app.all', async() => {

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

    it('should test 500 error handler without error', async() => {

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

    it('should test 500 error handler with app.then with 3 requests', async() => {

        let isTestFinished1 = false;
        let isTestFinished2 = false;
        let isTestFinished3 = false;

        app.then(error());
        app.then(async() => {
            throw new Error('test');
        });

        const server = http.createServer(app.resolve());
        await chai.request(server)
            .get('/')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                expect(err.message).to.be.equal('Internal Server Error');
                isTestFinished1 = true;
            });
        await chai.request(server)
            .get('/')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                expect(err.message).to.be.equal('Internal Server Error');
                isTestFinished2 = true;
            });
        await chai.request(server)
            .get('/')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                expect(err.message).to.be.equal('Internal Server Error');
                isTestFinished3 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
        expect(isTestFinished3).is.true;
    });

    it('should test 500 error handler with app.all with 3 requests', async() => {

        let isTestFinished1 = false;
        let isTestFinished2 = false;
        let isTestFinished3 = false;

        app.all([error()]);
        app.then(async() => {
            throw new Error('test');
        });

        const server = http.createServer(app.resolve());
        await chai.request(server)
            .get('/')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                expect(err.message).to.be.equal('Internal Server Error');
                isTestFinished1 = true;
            });
        await chai.request(server)
            .get('/')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                expect(err.message).to.be.equal('Internal Server Error');
                isTestFinished2 = true;
            });
        await chai.request(server)
            .get('/')
            .send()
            .catch(err => {
                expect(err).to.have.status(500);
                expect(err.message).to.be.equal('Internal Server Error');
                isTestFinished3 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
        expect(isTestFinished3).is.true;
    });

});
