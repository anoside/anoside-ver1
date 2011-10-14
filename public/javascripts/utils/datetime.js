define(function (require) {
  return {

    /**
     * 時刻を相対的に表示する
     */

    toRelativeTime: function (datetime) {
      return $.timeago(datetime);
    }
  };
});
