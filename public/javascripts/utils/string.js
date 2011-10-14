define(function (require) {
  return {

    /**
     * 文字列内のURLをリンクに置き換える
     */

    urlToLink: function (str) {
      var re = /(http:\/\/[\x21-\x7e]+)/gi;
      return str.replace(re, '<a target="_blank" href="$1">$1</a>');
    },

    /**
     * 文字列内の<, >, &などをエスケープする
     */

    escape: function (str) {
      // encode関数はjQuery Templateに定義されている
      return $.encode(str);
    },

    /**
     * 文字列内の改行コードを<br>に置換
     */

    lineBreaks: function (str) {
      return str.replace(/\r|\n|\r\n/g, '<br>');
    }
  };
});
