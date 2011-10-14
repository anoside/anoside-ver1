define(function (require) {
  return {

    /**
     * createdAtに保存されている時刻を相対的に表示する
     */

    toRelativeTime: function (objects) {
      _.each(objects, function (o) {
        o.createdAt = $.timeago(o.createdAt);
      });
    }
  };
});
