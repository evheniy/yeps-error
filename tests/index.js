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

    it('should test 404'/* , async () => {

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
     }*/);

    it('should test 500', async() => {

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

});
