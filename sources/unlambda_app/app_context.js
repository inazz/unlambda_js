
var unlambda_app = unlambda_app || {};

unlambda_app.AppContext = function() {
  this.run_state = unlambda_app.RUN_STATE.STOPPED;
  this.run_mode = null;
  this.step_limit = -1;
  this.runtime_context = null; // unlambda.runtime.RuntimeContext
};

unlambda_app.AppContext.prototype.getCurrentStep = function() {
  if (this.run_state == unlambda_app.RUN_STATE.STOPPED) {
    return 0;
  }
  return this.runtime_context.step;
};