var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/**
 * commentNumber
 * コメント番号。>>1とかできるようにするため。
 *
 * identityId
 * 投稿者のID。同じ投稿者でもポストごとに違うIDになる。
 *
 * isPostMaster
 * ポストの投稿者 == コメントの投稿者かどうかの真偽値。
 */

var CommentSchema = new Schema({
    body: { type: String, required: true }
  , commentNumber: { type: Number, required: true }
  , createdAt: { type: Date, default: Date.now }
  , identityId: { type: String, required: true }
  , isPostMaster: { type: Boolean, required: true }
  , byAdmin: { type: Boolean, default: false }
  , post: { type: ObjectId, ref: 'Post' }
  , user: { type: ObjectId, ref: 'User' }
});

exports.Comment = Comment = mongoose.model('Comment', CommentSchema);
