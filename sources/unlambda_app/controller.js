
var unlambda_app = unlambda_app || {};

// unlambda.Unlambda, util.LoopThreadFactory
unlambda_app.Controller = function(unl, loop_thread_factory) {
  this.unl = unl;
  this.loop_thread_factory = loop_thread_factory;
  this.run_thread = null;
};

unlambda_app.Controller.prototype.init = function() {
  var that = this;
  this.run_thread = loop_thread_factory.create(function() {that.run()});
};

unlambda_app.Controller.prototype.run = function() {
  // TODO.
};