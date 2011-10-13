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
      , 'click a.new-comment': 'newComment'
      , 'click button.create-comment': 'createComment'
      , 'click .new-comment a.cancel': 'hideNewCommentForm'
      , 'click .comments-count:not(.opened)': 'showComments'
      , 'click .comments-count.opened': 'closeComments'
      , 'click a.new-tag': 'newTag'
      , 'click button.create-tag': 'createTag'
      , 'click .new-tag a.cancel': 'hideNewTagForm'
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
      $('#newCommentFormTmpl').tmpl().appendTo($(e.currentTarget).parents('.post'));
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

          self.hideNewCommentForm(e);

          $('#showCommentsTmpl').tmpl(comment).appendTo(commentsElm);
        }
      });
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
      $('#newTagFormTmpl').tmpl().appendTo($(e.currentTarget).parents('.post'));
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

          self.hideNewTagForm(e);

          $('#showTagsTmpl').tmpl(tag).appendTo(tagsElm);
        }
      });
    },

    hideNewTagForm: function (e) {
      $(e.currentTarget).parent('.new-tag').remove();
    }
  });


  return {
    PostView: PostView,

    HomeTimelineView: PostView.extend({
      initialize: function () {
        _.bindAll(this, 'render');
        this.collection = new PostCollection.HomeTimeline();
        this.collection.bind('reset', this.render);
        this.collection.fetch();
      }
    }),

    SinglePostView: PostView.extend({
      initialize: function (id) {
        var commentsElm = $('ul.comments');

        this.collection = new CommentCollection.Comments(null, id);
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
