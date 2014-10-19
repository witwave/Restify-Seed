#Restify Seed
A starting point for building a scalable & maintainable [Restify](http://mcavage.me/node-restify/) REST API.

##About
Implementing a sensible abstraction, Restify Seed allows developers to stand up a solid Restify project in minutes. The architectural principles and dependencies behind Restify Seed encourage a proper separation of concerns, usage of modern design patterns, a testable codebase, and more.

##Guide

####_Installation_
```shell
$ git clone https://github.com/MatthewVita/Restify-Seed.git
$ cd Restify-Seed
$ npm install
$ npm install -g mocha
$ node app.js
+---------------------------------------------------------------+
| Application `Calendar App!` is running at http://0.0.0.0:1337 |
+---------------------------------------------------------------+
```

...then open up browser to [localhost:1337/api/calendar/weekday](localhost:1337/api/calendar/weekday)

####_Structure_
_(__TL;DR:__ just follow the provided "Calendar" application sample files in the project for an idea of how this seed project structures the code.)_

Restify Seed adheres to the Model-View-Controller pattern (where "Views" are simply the JSON output to be consumed by a client). Below are some example snippets of how to structure your code:

- First, define all configuration values in ```config.js``` (some defaults are provided):

```javascript
//see config.js for full example
exports.api = {
	name: 'Calendar App!',
	version: '0.0.1'
};

exports.environment = {
	name: 'development',
	port: 1337,
	salt: '', //generate one @ random.org
	//...and so on
```

- Second, add all necessary endpoints by creating a routes file in ```routes/```:

```javascript
//see routes/calendarRoutes.js for full example
function CalendarRoutes(api) {
	api.get('/api/calendar/weekday', rateLimit, function(req, res, next) {
		var calCtrl = new CalendarController(req, res, next);

		calCtrl.getCalendarDay();
	});

	api.post('/api/calendar/appointment', rateLimit, function(req, res, next) {
		var calCtrl = new CalendarController(req, res, next);
		//...and so on
```

- Third, add a controller in ```controllers/```:

```javascript
//see controllers/calendarController.js for full example
function CalendarController(req, res, next) {
	this.getCalendarDay = function() {
		var calModel = new CalendarModel();

		calModel.selectCalendarDay()
		.then(function(day) {
			res.send(200, day);
		})
		.catch(function(err) {
			res.send(500, {error: err});
		});
	};

	this.postCalendarAppointment = function() {
		var calModel = new CalendarModel();

		calModel.insertCalendarAppointment(req)
		.then(function(status) {
			res.send(201, status);
		//...and so on
```

- Fourth, add a model in ```models/```:

```javascript
//see models/calendarModel.js for full example
function CalendarModel() {
	this.selectCalendarDay = function() {
		return new RSVP.Promise(function(resolve, reject) {
			try {
				return resolve('Today is ' + moment().format('dddd') + '.');
			} catch (err) {
				return reject('Chronos took the day off.');
			}
		});
	};

	this.validateCalendarAppointment = function(req) {
		if (typeof(req) === 'undefined') {
			return {
				error: 'Provide appointment information.'
			};
		//...and so on
```

####_Testing_
See ```testing/calendarTests.js``` for example tests. To run the test suite, issue the following:

```shell
$ cd testing
$ mocha calendarTests.js 
Calendar Feature
		✓ should return current day of the week 
		✓ should add a new appointment 

	2 passing (10ms)

```
####_Promises_
[RSVP](https://github.com/tildeio/rsvp.js/) is the default promises library.

####_Rate Limiting_
Rate limiting can be implemented via the built-in Restify throttle package. A ```HTTP 429 - Too Many Requests``` will be issued to the consumer, so adjust your web server to a notice area as needed.

- Route-based approach:

```javascript
var rateLimit = restify.throttle({
	burst: 50,
	rate: 2,
	ip: true
});

function MyRoutes(api) {
	api.get('/api/some/route', rateLimit, function(req, res, next) {
		//..and so on
```

- Granular approach:

```javascript
function MyRoutes(api) {
	api.get('/api/some/route', restify.throttle({burst: 50,rate: 2,ip: true}), function(req, res, next) {
		//..and so on
```

- Global approach (not recommended in most cases):

```javascript
//would be in app.js
app.use(restify.throttle({
	burst: 50,
	rate: 2,
	ip: true
});
```

####_Parallel Computation_
A common misconception about Node is that computation cannot occur outside of the event loop. With the [Web Workers API](http://en.wikipedia.org/wiki/Web_worker), this is possible. Usage:

```javascript
this.generateQ3Report = function() {
	return new RSVP.Promise(function(resolve, reject) {
		var worker = new Parallel();
	
		worker.spawn(function() {
				//long running number crunch operation here...
				var report = '<resulting data here>';

			return report;
		})
		.then(function(workerOutput) {
			if (workerOutput.hasOwnProperty('error')) {
				return reject(workerOutput);
			}

			return resolve(workerOutput);
		});
	});
};
```

####_Common Utilities_
- [Crypto](http://github.com/evanvosberg/crypto-js) - "Defacto" encryption library. Great for PBKDF2 password hashing.
- [Lodash](https://github.com/lodash) - "Defacto" functional programming library.
- [Moment](http://momentjs.com/) - "Defacto" date/time library.

####_Intelligent Error Handling_
By leveraging [node domains](http://nodejs.org/api/domain.html), error handling is gracefully handled and optionally reported via the [emailjs](https://github.com/eleith/emailjs/) module (see ```config.js``` ->  ```config.environment``` to set up email logging).

##Considerations

####_Deployment_
Consider [PM2](https://github.com/Unitech/pm2). Usage:
```shell
$ pm2 start app.js -i max
```

####_Development_
Consider [Nodemon](https://github.com/remy/nodemon). Usage:
```shell
$ nodemon app.js
```

####_Web Sockets_
Restify actually supports web sockets [natively](http://mcavage.me/node-restify/#Socket.IO).

####_Load Balancing_
Consider [HAProxy](http://www.haproxy.org/).

####_Web/Proxy Server_
Consider [NGINX](http://nginx.com/resources/admin-guide/reverse-proxy/).

####_Caching_####
Consider the [Redis](https://github.com/mranney/node_redis/) module for caching.

####_Data Tier_####
Restify Seed has no opinions on data persistance.

##Todos
_(pull requests are welcomed!)_

- Build (or find) a middleware Restify contrib that returns ```X-Rate-Limit``` headers, handling rate limiting on a rate:interval basis.

- Build (or find) a middleware Restify contrib that handles endpoint caching with minimal, relatively unopinionated dependencies.

- Talk to devs at Parallel.js about adding a .catch({error func}) promise chain option rather than the .then({success func}, {error func}) style.

##License
MIT