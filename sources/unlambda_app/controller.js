
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
  var ctx = this.app.getAppContext();
  ctx.run_state = unlambda_app.RUN_STATE.STOPPED;
  ctx.run_mode = null;
  ctx.runtime_context = null;
  this.updateView();
};

unlambda_app.Controller.prototype.pause = function() {
  var ctx = this.app.getAppContext();
  if (ctx.run_state == unlambda_app.RUN_STATE.STOPPED) {
    return;
  }
  ctx.run_state = unlambda_app.RUN_STATE.PAUSED;
  this.updateView();
};

// unlambda_app.RUN_MODE, int
// -1 for limit to indicate run infinately.
unlambda_app.Controller.prototype.run = function(mode, limit) {
  var ctx = this.app.getAppContext();
  var ok = true;
  if (ctx.run_state == unlambda_app.RUN_STATE.STOPPED) {
    var code = this.app.getCodePanel().getCode();
    var parse_result = this.unl.parse(code);
    if (!parse_result.success) {
      this.app.getOutputPanel().setCompileError(
        code, parse_result.error, parse_result.error_pos);
      ok = false;
    } else {
      this.app.getOutputPanel().clear();
      ctx.runtime_context = this.unl.newContext(
        parse_result.variable, this.input_callback, this.output_callback);
    }
  }
  if (ok) {
    ctx.run_state = unlambda_app.RUN_STATE.RUNNING;
    ctx.run_mode = mode;
    ctx.step_limit = limit;
    this.run_thread.run();
  }
  this.updateView();
};

unlambda_app.Controller.prototype.onUnlambdaInput = function() {
  // TODO.
  return -1;
};
unlambda_app.Controller.prototype.onUnlambdaOutput = function(c) {
  this.app.getOutputPanel().appendOutput(c);
};

unlambda_app.Controller.prototype.updateView = function() {
  // TODO.
};