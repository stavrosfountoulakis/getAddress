
function Request (endpoint) {

  if(!(this instanceof Request)) {
    return new Request(endpoint);
  }

  if (!endpoint) {
    throw new Error('no endpoint provided');
  } else {
    this.endpoint = endpoint;
  }

}

Request.prototype.exec = function (callback) {

  if (typeof callback !== 'function') {
    throw new Error('no callback function provided');
  }

  this.endpoint.end(function (response) {

    callback({
      status: response.status,
      body: response.body
    });

  });

};

module.exports = Request;
