exports.api = {
  name: 'Seed',
  version: '0.0.1',
  secret: 'app_secret'
}

exports.environment = {
  name: 'development',
  bug_sender_email: {
    email: 'bugsend@app.com',
    password: 'bugsendpassword',
    smtp_host: 'smtp.app.com',
    ssl: true
  },
  bug_reciever_email: 'bugrecieve@app.com'
};

exports.redis = {
  servers: {
    primary: {
      host: '127.0.0.1', 
      port: 6379
    }
  }
};

exports.i18n = {
  locales: ['en', 'de'],
  directory: __dirname + '/locales'
};