define(function (require) {
  var CommentCollection = require('../collections/comment')
    , PostCollection    = require('../collections/post')
    , CommentModel      = require('../models/comment').Comment
    , TagModel          = require('../models/tag').Tag
    , datetime          = require('../utils/datetime');


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
      var posts = this.collection.toJSON();
      datetime.toRelativeTime(posts);
      $('#showPostsTmpl').tmpl(posts).appendTo('.post-component');
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

          self.hideNewCommentForm(e);
          self.renderComment(comment, commentsElm);
        }
      });
    },

    renderComment: function (comment, commentsElm) {
      $('#showCommentsTmpl').tmpl(comment).appendTo(commentsElm);
    },

    hideNewCommentForm: function (e) {
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
          datetime.toRelativeTime(response);
          $('#showCommentsTmpl').tmpl(response).appendTo(commentsUlElm);
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

          self.hideNewTagForm(e);
          self.renderTag(tag, tagsElm);
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
        var commentsElm = $('ul.comments')
          , postId = options.postId;

        this.socket = options.socket;
        PostView.prototype.initialize({ socket: this.socket });

        this.collection = new CommentCollection.Comments(null, postId);
        this.collection.fetch({
          success: function (collection, response) {
            datetime.toRelativeTime(response);
            $('#showCommentsTmpl').tmpl(response).appendTo(commentsElm);
          }
        });
        $('.datetime').timeago();
      }
    })
  }
});
