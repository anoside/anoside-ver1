define(function () {
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
    }),

    /**
     * ホーム画面のつぶやきを入力するフォーム
     */

    HomePostFormView: Backbone.View.extend({
      el: 'form',

      events: {
          'click #post': 'handleFormByMouse'
        , 'keydown #post': 'handleFormByKeyboard'
        , 'click #create': 'create'
      },

      create: function (e) {
        e.preventDefault();
        
        //$('form button').addClass('disabled');
        
        var csrf = $('.csrf').val()
          , post = $('#post').val();

        this.model.url = '/posts/create';

        this.model.save({ _csrf: csrf, post: post }, {
          success: function (model, response) {
            var post = response.post;

            $('form button').removeClass('disabled');
            $('textarea#post').val('');
            $('#showPostsTmpl').tmpl(post).prependTo('.post-component');
          }
        });
      },

      /**
       * 入力フォーム内でのマウスイベントを処理する
       */

      handleFormByMouse: function () {
        var textareaElm = $('textarea#post');
        
        // エンターキーの押下によって入力フォームが
        // 高くなっていないときだけ入力フォームを少し高くする
        if (textareaElm.css('height') === '16px') {
          textareaElm.css('height', '50px');
        }
      },
      
      /**
       * 入力フォーム内でのキーボードイベントを処理する
       */

      handleFormByKeyboard: function (e) {
        var textareaElm = $('textarea#post');
        
        // 入力フォームでエンターキーが押されたら、
        // 入力フォームを下に広げる
        // (shiftキーが同時に押されたときは投稿される)
        if (e.keyCode === 13 && e.shiftKey === false) {
          textareaElm.css('height', '120px');
        }

        // 何も入力されてないか、改行だけされてるときに
        // escキーが押されたら、入力フォームの高さを元に戻す
        if (e.keyCode === 27 && (textareaElm.val() === '' || textareaElm.val() === '\n')) {
          textareaElm.css('height', '16px');
        }

        // shift+enterでポストされる
        if (e.keyCode === 13 && e.shiftKey === true) {
          this.create(e);
        }
      }
    })
  }
});
