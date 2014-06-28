var FooModel = require('../models/foo');
var config = require('../config');

module.exports = function(req, res, next) {
  this.bop = function() {
    if (req.params.bar !== undefined && req.params.bar !== '') {
      var foo = new FooModel(req, res, next);
      foo.get_foo();
    } else {
      res.send(400, {error: res.__('foo_bop_validation')});
    }
  };
};