Restify-Seed
==============
Starting point for building a scalable [Restify](http://mcavage.me/node-restify/) API.

##Example##
See ```./routes/foo.js```:
```api.post('/baz/:id', ... ```
...and follow the code along to the controller and model to get a feel for how the codebase is structured.

##Includes:##
__MVC Design Pattern__

Helps separate concerns, ensuring a maintainable codebase.

__Content Negotiation__

JSON (or XML) response is available via:
```
Accept: application/json
```

__Spec Testing Library__

Using the included [Jasmine](https://github.com/mhevery/jasmine-node) library, simply include your API's tests in ```./testing```.

__Common Utilities__

- [Crypto](http://github.com/evanvosberg/crypto-js) - PBKDF2 password hasher
- [dsjslib](https://github.com/monmohan/dsjs/) - datastructures library
- [Lodash](https://github.com/lodash) - functional utilities library
- [Moment](http://momentjs.com/) - advanced date/time library

__Intelligent Error Handling__

By leveraging [domains](http://nodejs.org/api/domain.html), error handling is gracefully handled and (optionally) reported via the [emailjs](https://github.com/eleith/emailjs/) module (see config.js ```config.environment``` to set up email).

__Caching__

The [Redis](https://github.com/mranney/node_redis/) module is included for caching. Be sure to alter config.js ```redis.servers``` information to match your server(s). 

__Rate Limiting__

As seen in the code example (top of README.md), rate limiting is defined at the route-level for extra control. This [module](https://github.com/visionmedia/node-ratelimiter) depends on Redis for storage.

__i18n__

Internationalization can be achieved by specifying the API's locales in config.js and creating a js file of the same name in ```./locales```. The [module](http://github.com/mashpie/i18n-node) binds itself with the HTTP request such that this header:
```text
Accept-Language: de
```
...will determine the HTTP response's language (provided the module's ```res.__('output_key')``` format is used when responding).

##Notes

__Database Layer__

With an emphasis on keeping this project unopinionated, no O/RM or database utilities have been provided. This module will be determined by your use-case, just be sure to use the config.js for connection details and keep things DRY.

__Load Balancer__

If a load balancer is desired, consider [node-harmony](https://www.npmjs.org/package/node-harmony)


##Installation
Ensure Redis is installed on your platform, clone this repo (will have an NPM link up soon), cd to dir with package.json:

```
$ npm install
```

## License

  MIT
