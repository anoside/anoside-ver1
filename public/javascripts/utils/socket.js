define(function (require) {
  return {
    connect: function () {
      return io.connect('/');
    }
  }
});
