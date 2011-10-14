define(function (require) {
  var datetime = require('./datetime')
    , string   = require('./string');

  return {

    /**
     * ポストやコメントを表示するために文字列を加工する
     */

    convert: function (doc) {
      doc.body = string.escape(doc.body);
      doc.body = string.urlToLink(doc.body);
      doc.body = string.lineBreaks(doc.body);
      doc.createdAt = datetime.toRelativeTime(doc.createdAt);

      return doc;
    }
  }
});
