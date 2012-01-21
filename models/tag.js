var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

  
var TagSchema = new Schema({
    name: { type: String, required: true }
  , lowerName: { type: String, lowercase: true, required: true, unique: true }
  , createdAt: { type: Date, default: Date.now }
});


exports.Tag = Tag = mongoose.model('Tag', TagSchema);
