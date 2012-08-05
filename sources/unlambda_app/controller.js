
var unlambda_app = unlambda_app || {};

// unlambda_app.App, unlambda.Unlambda, util.LoopThreadFactory
unlambda_app.Controller = function(app, unl, loop_thread_factory) {
  this.app = app;
  this.unl = unl;
  this.loop_thread_factory = loop_thread_factory;
  this.run_thread = null;
  this.input_callback = null;
  this.output_callback = null;
};

unlambda_app.Controller.prototype.init = function() {
  var that = this;
  this.run_thread = this.loop_thread_factory.create(function() {that.run_()});
  this.input_callback = function() {that.onUnlambdaInput();};
  this.output_callback = function(c) {that.onUnlambdaOutput(c);};
};

unlambda_app.Controller.prototype.run_ = function() {
  // TODO.
};

unlambda_app.Controller.prototype.stop = function() {
  // TODO.
};

unlambda_app.Controller.prototype.pause = function() {
  // TODO.
};

// unlambda_app.RUN_MODE, int
// -1 for limit to indicate run infinately.
unlambda_app.Controller.prototype.run = function(mode, limit) {
  // TODO.
};

unlambda_app.Controller.prototype.onUnlambdaInput = function() {
  // TODO.
  return -1;
};
unlambda_app.Controller.prototype.onUnlambdaOutput = function(c) {
  this.app.getOutputPanel().appendOutput(c);
};
