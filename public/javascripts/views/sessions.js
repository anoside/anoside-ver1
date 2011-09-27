define(function () {
  return {
    SigninFormView: Backbone.View.extend({
      el: 'form',

      events: {
        'submit': 'create'
      },

      create: function (e) {
        e.preventDefault();
        //console.log('create called');
        
        $('form button').addClass('disabled');
        
        var csrf = $('#csrf').val()
          , signinid = $('#signinid').val()
          , password = $('#password').val();

        $.ajax({
            type: 'POST'
          , url: '/sessions/create'
          , data: { signinid: signinid, password: password }
          , success: function () {
            location.href = '/';
          }
          , error: function (data) {
            $('form button').removeClass('disabled');
            $('ul.errors li').remove();
            var errors = JSON.parse(data.responseText).errors;
            _.each(errors, function (error) {
              $('ul.errors').append('<li>' + error + '</li>');
            });
          }
        });
      }
    })
  }
});
