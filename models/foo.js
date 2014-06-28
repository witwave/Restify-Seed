module.exports = function(req, res, next) {
  this.get_foo = function() {
    //logic
    //...

    //should return data from a real data source
    res.send(200, res.__('foo_greeting'));
  }
}