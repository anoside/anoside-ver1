define(function (require) {
  var doc = require('../utils/doc');

  return {
    SignupFormView: Backbone.View.extend({
      el: 'form',

      events: {
        'submit': 'create'
      },

      create: function (e) {
        e.preventDefault();
        
        $('form button').addClass('disabled');
        
        var csrf = $('#csrf').val()
          , signinid = $('#signinid').val()
          , password = $('#password').val();

        this.model.url = '/users/create';

        this.model.save({ _csrf: csrf, signinid: signinid, password: password }, {
          success: function () {
            location.href = '/';
          },
          error: function (model, response) {
            $('form button').removeClass('disabled');
            $('ul.errors li').remove();
            var errors = JSON.parse(response.responseText).errors;
            _.each(errors, function (error) {
              $('ul.errors').append('<li>' + error + '</li>');
            });
          }
        });
      }
    })
  }
});
