define(function (require) {
  return {

    /**
     * created_atに保存されている時刻を相対的に表示する
     */

    toRelativeTime: function (objects) {
      _.each(objects, function (o) {
        o.created_at = $.timeago(o.created_at);
      });
    }
  };
});
