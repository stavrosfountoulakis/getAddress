var Lab = require('lab');
var Code = require('code');
var sinon = require('sinon');

var Request = require('../lib/request');
var unirest = require('unirest');

var lab = exports.lab = Lab.script();

var experiment = lab.experiment;
var test = lab.test;
var expect = Code.expect;

experiment('Request', function () {

  experiment('#new', function () {

    test('returns a \'Request\' object', function (done) {

      var r = new Request(unirest.get('http://www.google.co.uk'));

      expect(r).to.be.an.instanceof(Request);
      done();

    });

    test('doesn\'t require the \'new\' keyword to create an instance of \'Request\'', function (done) {

      var r = Request(unirest.get('http://www.google.co.uk'));

      expect(r).to.be.an.instanceof(Request);
      done();

    });

    test('require\'s a single parameter, \'endpoint\', that is a valid \'unirest\' object', function (done) {

      var r = new Request(unirest.get('http://www.google.co.uk'));

      expect(r.endpoint).to.be.an.object();
      expect(r.endpoint.options).to.be.an.object();
      done();

    });

    test('throws an error if the \'endpoint\' paramter isn\'t provided', function (done) {

      var throws = function () {
        return new Request();
      };

      expect(throws).to.throw(Error, 'no endpoint provided');
      done();

    });

  });

  experiment('#exec', function () {

    test('is a method of the \'Request\' object', function (done) {

      var r = new Request(unirest.get('http://www.google.co.uk'));

      expect(r.exec).to.be.a.function();
      done();

    });

    test('expects a callback as it\'s only parameter', function (done) {

      var r = new Request(unirest.get('http://www.google.co.uk'));
      var spy = sinon.spy(r, 'exec');

      r.exec(function () {});

      expect(spy.called).to.equal(true);
      expect(spy.args[0][0]).to.be.a.function();
      done();

    });

    test('will throw an error if a callback isn\'t provided', function (done) {

      var r = new Request(unirest.get('http://www.google.co.uk'));
      var throws = function () {
        r.exec('not a function');
      };

      expect(throws).to.throw(Error, 'no callback function provided');
      done();

    });

    test('will make the call to the external api', function (done) {

      var r = new Request(unirest.get('http://www.google.co.uk'));
      var spy = sinon.spy(r.endpoint, 'end');

      r.exec(function (response) {});

      expect(spy.called).to.equal(true);
      done();

    });

  });


});
