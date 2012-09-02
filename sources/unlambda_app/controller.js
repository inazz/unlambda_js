
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

unlambda_app.Controller.MAX_BURST_STEP = 5000;

unlambda_app.Controller.prototype.init = function() {
  var that = this;
  this.run_thread = this.loop_thread_factory.create(
    function() {return that.run_()});
  this.input_callback = function() {return that.onUnlambdaInput();};
  this.output_callback = function(c) {that.onUnlambdaOutput(c);};
};

unlambda_app.Controller.prototype.run_ = function() {
  var ctx = this.app.getAppContext();
  if (ctx.run_state != unlambda_app.RUN_STATE.RUNNING) {
    return false;
  }
  this.setUpRuntimeStepLimit(ctx);
  this.unl.run(ctx.runtime_context);
  switch (ctx.runtime_context.state) {
  case unlambda.runtime.STATE.EXITED:
    ctx.run_state = unlambda_app.RUN_STATE.STOPPED;
    this.updateView();
    return false;
  case unlambda.runtime.STATE.INPUT_WAIT:
    ctx.run_state = unlambda_app.RUN_STATE.INPUT_WAIT;
    this.updateView();
    return false;
  case unlambda.runtime.STATE.STEP_LIMIT:
    if (ctx.getCurrentStep() == ctx.step_limit) {
      ctx.run_state = unlambda_app.RUN_STATE.PAUSED;
      this.updateView();
      return false;
    } else if (ctx.run_mode == unlambda_app.RUN_MODE.RUN_STEP){
      this.updateView();
    }
    return true;
  default:
    throw 'unexpected runtime result!';
  }
};

unlambda_app.Controller.prototype.setUpRuntimeStepLimit = function(ctx) {
  var cur_step = ctx.getCurrentStep();
  if (ctx.run_mode == unlambda_app.RUN_MODE.RUN_STEP) {
    if (cur_step == ctx.step_limit) {
      ctx.runtime_context.step_limit = cur_step;
    } else {
      ctx.runtime_context.step_limit = cur_step + 1;
    }
  } else {
    if (ctx.step_limit == -1) {
      ctx.runtime_context.step_limit =
        cur_step + unlambda_app.Controller.MAX_BURST_STEP;
    } else {
      ctx.runtime_context.step_limit = Math.min(
        ctx.step_limit, cur_step + unlambda_app.Controller.MAX_BURST_STEP);
    }
  }
};

unlambda_app.Controller.prototype.stop = function() {
  var ctx = this.app.getAppContext();
  this.fillNextApplyIfRunning();
  ctx.run_state = unlambda_app.RUN_STATE.STOPPED;
  this.updateView();
};

unlambda_app.Controller.prototype.pause = function() {
  var ctx = this.app.getAppContext();
  if (ctx.run_state == unlambda_app.RUN_STATE.STOPPED) {
    return;
  }
  this.fillNextApplyIfRunning();
  ctx.run_state = unlambda_app.RUN_STATE.PAUSED;
  this.updateView();
};

unlambda_app.Controller.prototype.fillNextApplyIfRunning = function() {
  var ctx = this.app.getAppContext();
  if (ctx.run_state != unlambda_app.RUN_STATE.RUNNING)
    return;
  var rctx = ctx.runtime_context;
  var original_step_limit = rctx.step_limit;

  rctx.step_limit = rctx.step;
  this.unl.run(rctx);
  rctx.step_limit = original_step_limit;
};

// unlambda_app.RUN_MODE, int
// -1 for limit to indicate run infinately.
unlambda_app.Controller.prototype.run = function(mode, limit) {
  var ctx = this.app.getAppContext();
  var ok = true;
  if (ctx.run_state == unlambda_app.RUN_STATE.STOPPED) {
    this.app.getOutputPanel().clear();
    this.app.getStatusPanel().clear();
    var code = this.app.getInputCodePanel().getCode();
    var parse_result = this.unl.parse(code);
    if (!parse_result.success) {
      this.app.getStatusPanel().setCompileError(
        code, parse_result.error, parse_result.error_pos);
      ok = false;
    } else {
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

unlambda_app.Controller.prototype.setThreadWaitInterval = function(t) {
  this.run_thread.setInterval(t);
};

unlambda_app.Controller.prototype.onInputChange = function() {
  var ctx = this.app.getAppContext();
  if (ctx.run_state == unlambda_app.RUN_STATE.INPUT_WAIT) {
    ctx.run_state = unlambda_app.RUN_STATE.RUNNING;
    this.run_thread.run();
  }
};

unlambda_app.Controller.prototype.onUnlambdaInput = function() {
  var c = this.app.getInputPanel().consumeCharacter();
  if (this.app.getInputPanel().getEchoBackMode() &&
      c != unlambda.runtime.IO_CODE.EOF &&
      c != unlambda.runtime.IO_CODE.BLOCK) {
    this.app.getOutputPanel().appendInputEchoBack(c);
  }
  return c;
};

unlambda_app.Controller.prototype.onUnlambdaOutput = function(c) {
  this.app.getOutputPanel().appendOutput(c);
};

unlambda_app.Controller.prototype.updateView = function() {
  this.app.getControlPanel().updateView();
  this.app.getCurrentCodePanel().updateView();
  this.app.getInputCodePanel().updateView();
  this.app.getStatusPanel().updateView();
};