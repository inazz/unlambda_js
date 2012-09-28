
window.onload = function() {
  var app = unlambda_app.App.create(window, document);
  app.init();
  // that's global variable!
  the_app = app;
};
