
var unlambda_app = unlambda_app || {};

unlambda_app.AppContext = function() {
  this.state = unlambda_app.APP_STATE.STOPPED;
  this.runtime_context = null; // unlambda.runtime.RuntimeContext
};
