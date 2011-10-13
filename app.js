var express    = require('express')
  , RedisStore = require('connect-redis')(express)
  , mongoose   = require('mongoose')
  , stylus     = require('stylus');

var app = module.exports = express.createServer();


app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
      secret: 'keyboard cat'
    , store: new RedisStore
    , cookie: { httpOnly: false }
  }));
  app.configure('development', 'production', function () {
    app.use(express.csrf());
  });
  app.use(app.router);
  app.use(stylus.middleware({
      src: __dirname + '/assets'
    , dest: __dirname + '/public'
  }));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  mongoose.connect('mongodb://localhost/anoside_development');
  app.listen(3000);
  console.log('%s server, localhost:%d', app.settings.env, app.address().port);
});

app.configure('test', function () {
  mongoose.connect('mongodb://localhost/anoside_test');
});

app.configure('production', function () {
  app.use(express.errorHandler()); 
});


require('./controllers/comments')(app);
require('./controllers/posts')(app);
require('./controllers/sessions')(app);
require('./controllers/tags')(app);
require('./controllers/users')(app);
