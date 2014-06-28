var crypt = require('crypto-js');
var config = require('../config');

module.exports = function(req, res, next) {

  this.app_secret = config.secret;

  this.authenticate_user = function(username, password) {
    //Validate username & password

    //Look up user in database

    //If user exists, compare stored password with: 
    /*
    var pw = crypt.PBKDF2(password, this.app_secret) {
      keySize: 512/32,
      iterations: 10 
    }).toString()
    */
    
    //If valid, return new token from token_store
    //Else, return next(new restify.NotAuthorizedError());
  };

  this.authorize_token = function(token) {
    //Validate token

    //Look up token in database

    //If exists, increase expiry
    //Else, return next(new restify.NotAuthorizedError());
  };
};