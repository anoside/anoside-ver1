define(function (require) {
  var CommentCollection = require('../collections/comment')
    , PostCollection    = require('../collections/post')
    , CommentModel      = require('../models/comment').Comment
    , PostModel         = require('../models/post')
    , TagModel          = require('../models/tag').Tag
    , doc               = require('../utils/doc');


  /**
   * ポスト一つ一つのビュー
   */

  var PostView = Backbone.View.extend({
    el: '.post-component',

    events: {
        'mouseover .post': 'showMenu'
      , 'mouseout .post': 'hideMenu'
      , 'click .new-comment': 'newComment'
      , 'click button.create-comment': 'createComment'
      , 'click .new-comment .cancel': 'hideNewCommentForm'
      , 'click .comments-count:not(.opened)': 'showComments'
      , 'click .comments-count.opened': 'closeComments'
      , 'click .new-tag': 'newTag'
      , 'click button.create-tag': 'createTag'
      , 'click .new-tag .cancel': 'hideNewTagForm'
    },

    initialize: function (options) {
      var self = this;

      // 子クラスから渡されたsocketオブジェクトをthisに代入
      self.socket = options.socket;

      self.socket.on('showComment', function (comment) {
        var commentsElm = $('.post-component [data-post-id=' + comment.post + '] ul.comments');
        self.renderComment(comment, commentsElm);
      });

      self.socket.on('showTag', function (tag) {
        var tagsElm = $('.post-component [data-post-id=' + tag.postId + '] .tags');
        self.renderTag(tag, tagsElm);
      });
    },

    render: function () {
      var posts = this.collection.toJSON()
        , convertedPosts = posts.map(function (post) { return doc.convert(post) });

      $('#showPostsTmpl').tmpl(convertedPosts).appendTo('.post-component');
    },

    showMenu: function (e) {
      $(e.currentTarget).children('.footer').children('.menu').css('display', 'inline');
    },

    hideMenu: function (e) {
      $(e.currentTarget).children('.footer').children('.menu').css('display', 'none');
    },

    newComment: function (e) {
      var postElm = $(e.currentTarget).parents('.post');

      if (postElm.find('div.new-comment').length === 0) {
        $('#newCommentFormTmpl').tmpl().appendTo(postElm);
      }
    },

    createComment: function (e) {
      var self = this
        , currentElm = $(e.currentTarget)
        , postId = currentElm.parents('.post').attr('data-post-id')
        , csrf = currentElm.siblings('.csrf').val()
        , body = currentElm.siblings('.body').val()
        , comment = new CommentModel();

      comment.url = '/comments/create';

      comment.save({ _csrf: csrf, body: body, post_id: postId }, {
        success: function (model, response) {
          var comment = response.comment
            , commentsElm = currentElm.parent().siblings('ul.comments');

          self.socket.emit('createComment', comment);

          currentElm.parent('.new-comment').remove();
          self.renderComment(comment, commentsElm);
        }
      });
    },

    renderComment: function (comment, commentsElm) {
      var convertedComment = doc.convert(comment);

      $('#showCommentsTmpl').tmpl(convertedComment).appendTo(commentsElm);
    },

    hideNewCommentForm: function (e) {
      //console.log($(e.currentTarget));
      $(e.currentTarget).parent('.new-comment').remove();
    },

    showComments: function (e) {
      var postId = $(e.currentTarget).parents('.post').attr('data-post-id')
        , commentsUlElm = $(e.currentTarget).parent().siblings('ul.comments');

      // 「nコメント」リンクをクリックしてコメントを表示していることを示す値をクラスに付加する
      $(e.currentTarget).addClass('opened');

      // すでに表示されているコメントを全て消す
      if (commentsUlElm.children().length !== 0) {
        commentsUlElm.children().remove();
      }

      // closeComments()が呼び出されたあとに付加されたdisplay: noneを除去する
      if (commentsUlElm.css('display') === 'none') {
        commentsUlElm.css('display', '');
      }

      this.collection = new CommentCollection.Comments(null, postId);
      this.collection.fetch({
        success: function (collection, response) {
          var convertedComments = response.map(function (comment) { return doc.convert(comment) });

          $('#showCommentsTmpl').tmpl(convertedComments).appendTo(commentsUlElm);
        }
      });
    },

    closeComments: function (e) {
      $(e.currentTarget).parent().siblings('ul.comments').css('display', 'none');
      $(e.currentTarget).removeClass('opened');
    },

    newTag: function (e) {
      var postElm = $(e.currentTarget).parents('.post');

      if (postElm.find('div.new-tag').length === 0) {
        $('#newTagFormTmpl').tmpl().appendTo(postElm);
      }
    },

    createTag: function (e) {
      var self = this
        , currentElm = $(e.currentTarget)
        , postId = currentElm.parents('.post').attr('data-post-id')
        , csrf = currentElm.siblings('.csrf').val()
        , tagName = currentElm.siblings('.name').val()
        , tag = new TagModel();

      tag.url = '/tags/create';

      tag.save({ _csrf: csrf, name: tagName, post_id: postId }, {
        success: function (model, response) {
          var tag = response.tag
            , tagsElm = currentElm.parent().siblings('.tags');

          self.socket.emit('createTag', _.extend(tag, { postId: postId }));

          currentElm.parent('.new-tag').remove();
          self.renderTag(tag, tagsElm);
        },

        error: function (data, response) {
          $('#showErrors').tmpl(JSON.parse(response.responseText)).appendTo(currentElm.siblings('ul.errors'));
        }
      });
    },

    renderTag: function (tag, tagsElm) {
      $('#showTagsTmpl').tmpl(tag).appendTo(tagsElm);
    },

    hideNewTagForm: function (e) {
      $(e.currentTarget).parent('.new-tag').remove();
    }
  });


  return {
    PostView: PostView,

    HomeTimelineView: PostView.extend({
      initialize: function (options) {
        this.socket = options.socket;
        // 親クラスであるPostViewのコンストラクタにsocketを渡す
        PostView.prototype.initialize({ socket: this.socket });

        _.bindAll(this, 'render');
        this.collection = new PostCollection.HomeTimeline();
        this.collection.bind('reset', this.render);
        this.collection.fetch();
      }
    }),

    SinglePostView: PostView.extend({
      initialize: function (options) {
        var postElm = $('.post-component')
          , postId = options.postId;

        this.socket = options.socket;
        PostView.prototype.initialize({ socket: this.socket });

        this.model = new PostModel.SinglePost({ postId: postId });
        this.model.fetch({
          success: function (collection, response) {
            var convertedPost = doc.convert(response)
              , convertedComments = response.comments.map(function (comment) { return doc.convert(comment) });
            
            $('#showPostsTmpl').tmpl(convertedPost).appendTo(postElm);
            $('#showCommentsTmpl').tmpl(convertedComments).appendTo($('ul.comments'));

            document.title = convertedPost.title + ' - Anoside';
            $('.datetime').timeago();
          }
        });
      }
    })
  }
});
