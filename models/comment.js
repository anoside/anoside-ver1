var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

/**
 * identityId
 * 投稿者のID。同じ投稿者でもポストごとに違うIDになる。
 *
 * isMaster
 * ポストの投稿者 == コメントの投稿者かどうかの真偽値。
 */

var CommentSchema = new Schema({
    body: { type: String, required: true }
  , createdAt: { type: Date, default: Date.now }
  , identityId: { type: String, required: true }
  , isPostMaster: { type: Boolean, required: true }
  , post: { type: ObjectId, ref: 'Post' }
  , user: { type: ObjectId, ref: 'User' }
});

exports.Comment = Comment = mongoose.model('Comment', CommentSchema);
