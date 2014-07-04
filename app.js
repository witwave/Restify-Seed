var restify = require('restify');
var file_system = require('fs');
var i18n = require('i18n');
var xml = require('xml');
var email = require("emailjs");
var domain = require('domain');
var config = require('./config');

//Server instance with registered options
var api = restify.createServer({ 
  name: config.api.name,
  formatters: {
    'text/xml': function(req, res, body) {
      return xml(body);
    },
    'application/json': function(req, res, body){
      return JSON.stringify(body);
    }    
  }
});

api.use(restify.acceptParser(api.acceptable));
api.use(restify.bodyParser());
api.use(restify.authorizationParser());

//Global error handler
api.use(function(req, res, next) {
  var domain_handler = domain.create();
  
  domain_handler.on('error', function(err) {
    var error_message = 'Request: \n' + req + '\n';
    error_message += 'Response: \n' + res + '\n';
    error_message += 'Context: \n' + err;

    console.error(error_message);
    domain.dispose;
  });    

  domain_handler.enter();
  next();
});

console.error = function(error_message) {
  if (config.environment.name === 'development') {
    var sender = config.environment.bug_sender_email;
    var reciever = config.environment.bug_reciever_email;

    var email_client = email.server.connect({
      user: sender.email, 
      password: sender.password, 
      host: sender.smtp_host, 
      ssl: sender.ssl
    });

    email_client.send({
      text: error_message, 
      from: '<' + sender.email + '>', 
      to: '<' + reciever + '>',
      subject: config.api.name + ' - Error'
    });
  } else {
    console.log(error_message);
  }
};

//Instance of i18n. Hooks into each (valid) request
i18n.configure({
  locales: config.i18n.locales,
  directory: config.i18n.directory
});

api.use(i18n.init);

//Iterates through all ./routes files to find matching route
file_system.readdirSync('./routes').forEach(function (cur_file) {
  if(cur_file.substr(-3) === '.js') {
    route = require('./routes/' + cur_file);
    route.routes(api);
  }
});

api.listen(config.environment.port);