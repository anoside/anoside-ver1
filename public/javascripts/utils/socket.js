define(function (require) {
  return {
    connect: function () {
      return io.connect('http://localhost');
    }
  }
});
