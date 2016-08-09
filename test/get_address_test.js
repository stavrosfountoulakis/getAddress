
var Lab = require('lab');
var Code = require('code');
var sinon = require('sinon');
var _ = require('lodash');

var GetAddress = require('../lib/get_address');
var Request = require('../lib/request');

var lab = exports.lab = Lab.script();

var experiment = lab.experiment;
var test = lab.test;
var expect = Code.expect;

experiment('GetAddress', function () {

  lab.beforeEach(function (done) {

    process.env['GA_KEY'] = 'aaaaaaaaaaaaaaaaaaaaaaaaaa';
    done();

  });

  experiment('#new', function () {

    test('returns a \'GetAddress\' object', function (done) {

      var ga = new GetAddress();

      expect(ga).to.be.an.instanceof(GetAddress);
      done();

    });

    test('doesn\'t require the \'new\' keyword to create an instance of \'GetAddress\'', function (done) {

      var ga = GetAddress();

      expect(ga).to.be.an.instanceof(GetAddress);
      done();

    });

    test('throws an error if initialised without an api key', function (done) {

      process.env['GA_KEY'] = null;

      var throws = function () {
        return new GetAddress();
      };

      expect(throws).to.throw(Error, 'invalid api key');
      done();

    });

    test('throws and error if initialised with an api key < 26 characters', function (done) {
    
      process.env['GA_KEY'] = 'aaaaaaaaaaaaaaaaaaaaaaaaa' // 25

      var throws = function () {
        return new GetAddress();
      };

      expect(throws).to.throw(Error, 'invalid api key');
      done();

    });

    test('doesn\'t throw an error if the api key appears valid (26 characters)', function (done) {

      var throws = function () {
        return new GetAddress();
      };

      expect(throws).to.not.throw();
      done();

    });

    test('loads api configuration', function (done) {

      var ga = new GetAddress();

      expect(ga.options).to.be.an.object();
      expect(ga.options).to.deep.equal(require('../config/config.json'));
      done();

    });

  });

  experiment('.options', function () {

    test('to have only the number of options required', function (done) {

      var ga = new GetAddress();

      expect(ga.options).to.have.length(3);
      done();

    });

    test('to have sane defaults', function (done) {

      var ga = new GetAddress();

      expect(ga.options.api).to.equal('https://api.getaddress.io');
      expect(ga.options.locate).to.equal('/v2/uk');
      expect(ga.options.usage).to.equal('/usage');
      done();

    });

  });

  experiment('.auth', function () {

    test('to be a valid property for use in making api calls', function (done) {

      var ga = new GetAddress();

      expect(ga.auth).to.deep.equal({
        user: 'api-key',
        pass: 'aaaaaaaaaaaaaaaaaaaaaaaaaa'
      });
      done();

    });

  });

  experiment('.endpoints', function () {

    test('to include a valid endpoint for \'usage\' calls', function (done) {

      var ga = new GetAddress();

      expect(ga.endpoints).to.be.an.object();
      expect(ga.endpoints.usage).to.be.an.object();
      expect(ga.endpoints.usage.options.url).to.equal('https://api.getaddress.io/usage');
      expect(ga.endpoints.usage.options.auth).to.deep.equal({
        user: 'api-key',
        pass: 'aaaaaaaaaaaaaaaaaaaaaaaaaa'
      });
      done();

    });

    test('to include a valid endpoint for \'locate\' calls', function (done) {
    
      var ga = new GetAddress();

      expect(ga.endpoints).to.be.an.object();
      expect(ga.endpoints.locate).to.be.an.object();
      expect(ga.endpoints.locate.options.url).to.equal('https://api.getaddress.io/v2/uk');
      expect(ga.endpoints.locate.options.auth).to.deep.equal({
        user: 'api-key',
        pass: 'aaaaaaaaaaaaaaaaaaaaaaaaaa'
      });
      done();

    });

  });

  experiment('#request', function () {

    test('is a method of the \'GetAddress\' object', function (done) {

      var ga = new GetAddress();

      expect(ga.request).to.be.a.function();
      done();

    });

  });

  experiment('#usage', function () {

    test('is a method of the \'GetAddress\' object', function (done) {

      var ga = new GetAddress();

      expect(ga.usage).to.be.a.function();
      done();

    });

    test('accepts a single parameter, the \'callback\' function', function (done) {

      var ga = new GetAddress();
      var spy = sinon.spy(ga, 'usage');

      ga.usage(function (response) {});

      expect(spy.called).to.equal(true);
      expect(_.flattenDeep(spy.args).length).to.equal(1);
      expect(spy.args[0][0]).to.be.a.function();
      done();

    });

    test('will throw an error if called without a \'callback\' function', function (done) {

      var ga = new GetAddress();
      var spy = sinon.spy(ga, 'usage');

      var throws = function () {
        return ga.usage('not a function');
      };

      expect(throws).to.throw(Error, 'no callback function provided');
      done();

    });

    test('will return an object you can use to make the request', function (done) {

      var ga = new GetAddress();
      var r = ga.usage(function (response) {});

      expect(r).to.be.an.object();
      expect(r.endpoint).to.be.an.object();
      expect(r.request).to.be.an.instanceof(Request);
      expect(r.exec).to.be.a.function();
      done();

    });

    test('can be run by calling #exec on the object returned', function (done) {

      var ga = new GetAddress();
      var r = ga.usage(function (response) {});
      var spy = sinon.spy(r, 'exec');

      r.exec();

      expect(spy.called).to.equal(true);
      done();

    });

  });

  experiment('#locate', function () {

    test('is a method of the \'GetAddress\' object', function (done) {

      var ga = new GetAddress();

      expect(ga.locate).to.be.a.function();
      done();

    });

    test('accepts a \'query\' parameter as it\'s first parameter that should be a string', function (done) {

      var ga = new GetAddress();
      var spy = sinon.spy(ga, 'locate');

      ga.locate('wv13ad', function (response) {});

      expect(spy.called).to.equal(true);
      expect(_.flattenDeep(spy.args).length).to.equal(2);
      expect(spy.args[0][0]).to.equal('wv13ad');
      done();

    });

    test('will throw an error if it\'s first parameter isn\'t a string', function (done) {

      var ga = new GetAddress();

      var throws = function () {
        return ga.locate(42);
      };

      expect(throws).to.throw(Error, 'called with an invalid query');
      done();

    });

    test('will throw an error if it\'s first parameter isn\'t a valid postcode format', function (done) {

      var ga = new GetAddress();

      var throws = function () {
        return ga.locate('xxxxxx', function (response) {});
      }

      expect(throws).to.throw(Error, 'called with an invalid query');
      done();

    });

    test('accepts a \'callback\' function as it\'s second argument', function (done) {

      var ga = new GetAddress();
      var spy = sinon.spy(ga, 'locate');

      ga.locate('wv13ad', function(response) {});

      expect(spy.called).to.equal(true);
      expect(spy.args[0][1]).to.be.a.function();
      done();

    });

    test('will throw an error if called without a \'callback\' function', function (done) {

      var ga = new GetAddress();

      var throws = function () {
        return ga.locate('wv13ad', 'not a function');
      };

      expect(throws).to.throw(Error, 'no callback function provided');
      done();

    });

    test('will modify the endpoint of the request to include the query', function (done) {

      var ga = GetAddress();

      ga.locate('wv13ad', function (response) {});

      expect(ga.endpoints.locate.options.url).to.equal('https://api.getaddress.io/v2/uk/wv13ad');
      done();

    });

    test('will return an object you can use to make the request', function (done) {

      var ga = new GetAddress();
      var r = ga.locate('wv13ad', function (response) {});

      expect(r).to.be.an.object();
      expect(r.endpoint).to.be.an.object();
      expect(r.request).to.be.an.instanceof(Request);
      expect(r.exec).to.be.a.function();
      done();

    });

    test('can be run by calling #exec on the object returned', function (done) {

      var ga = new GetAddress();
      var r = ga.locate('wv13ad', function (response) {});
      var locate_spy = sinon.spy(r, 'exec');
      var request_spy = sinon.spy(r.request, 'exec');

      r.exec();

      expect(locate_spy.called).to.equal(true);
      expect(request_spy.called).to.equal(true);

      done();

    });

  });

});
