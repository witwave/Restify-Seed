var FooController = require('../controllers/foo');
var config = require('../config');
var redis = require("redis");
var Limiter = require("ratelimiter");

var cache = redis.createClient(
  config.redis.servers.primary.port,
  config.redis.servers.primary.host
);

module.exports.routes = function(api) {
  api.post('/baz/:id', function (req, res, next) {
    //Auth user via users model's auth functions
    //...

    var limit = new Limiter({
      id: req.route.name + '-' + req.params.token,
      db: cache,
      duration: 60000,
      max: 100
    });

    limit.get(function (err, limit) {
      if (limit.remaining) {
        //Check if cache exists
        //...

        var foo = new FooController(req, res, next);
        foo.bop();
      } else {
        var retry = limit.reset - (Date.now() / 100) | 0;
        res.set('Retry-After', retry);

        res.send(429, {error: res.__('throttling_notice')});
      }
    });
  });
};