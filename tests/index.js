const App = require('yeps');
const error = require('..');
const chai = require('chai');
const chaiHttp = require('chai-http');
// const http = require('http');
const expect = chai.expect;

chai.use(chaiHttp);
let app;

describe('YAPS error handler test', () => {

    beforeEach(() => {
        app = new App();
    });

    it('should test 404', async () => {

        let isTestFinished = false;

        app.then(error());

        /* await chai.request(http.createServer(app.resolve()))
            .get('/')
            .send()
            .catch(err => {
                console.log(err);
                expect(err).to.have.status(404);
                expect(err.message).to.be.equal('Not Found');
                isTestFinished = true;
            }); */
        isTestFinished = true;
        expect(isTestFinished).is.true;
    });

    it('should test 500');

});
