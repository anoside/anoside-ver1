define(function (require) {
  require.ready(function () {
    var SessionRoute = require('routes/session').Route
      , TagRoute     = require('routes/tag').Route
      , UserRoute    = require('routes/user').Route;

    new SessionRoute();
    new TagRoute();
    new UserRoute();

    Backbone.history.start({ pushState: true });
  });
});
