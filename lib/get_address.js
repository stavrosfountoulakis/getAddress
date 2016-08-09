
function GetAddress () {

  if (!(this instanceof GetAddress)) {
    return new GetAddress();
  }

  this.key = process.env['GA_KEY'];

  if (!this.key || this.key.length !== 26) {
    throw new Error('invalid api key');
  }

  this.options = require('../config/config.json');

  this.auth = {
    user: 'api-key',
    pass: this.key
  };

  this.endpoints = {
    usage: require('unirest').get(this.options.api + this.options.usage),
    locate: require('unirest').get(this.options.api + this.options.locate)
  }

  this.endpoints.usage.auth(this.auth);
  this.endpoints.locate.auth(this.auth);

}

GetAddress.prototype.request = require('./request');

GetAddress.prototype.usage = function (callback) {

  if (typeof callback !== 'function') {
    throw new Error('no callback function provided');
  }

  // call #exec on the returned object to complete the request.
  return {

    endpoint: this.endpoints.usage,
    request: this.request(this.endpoints.usage),
    exec: function () {
      this.request.exec(callback);
    }

  }

};

GetAddress.prototype.locate = function (query, callback) {

  if (typeof query !== 'string' || !this.is_postcode(query)) {
    throw new Error('called with an invalid query');
  }

  if (typeof callback !== 'function') {
    throw new Error('no callback function provided');
  }

  // add the query onto the end of the current request
  var url = this.endpoints.locate.options.url;
  this.endpoints.locate.options.url = url + '/' + query;

  // call #exec on the returned object to complete the request
  return {

    endpoint: this.endpoints.locate,
    request: this.request(this.endpoints.locate),
    exec: function () {
      this.request.exec(callback);
    }

  }

};

GetAddress.prototype.is_postcode = function (postcode) {

  var re = new RegExp(/[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/i);

  if (re.test(postcode)) {
    return true
  } else {
    return false
  }

};

module.exports = GetAddress;
