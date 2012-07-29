
var page = page || {};

page.AppContext = function() {
  this.state = page.APP_STATE.STOPPED;
  this.runtime_context = null; // unlambda.runtime.RuntimeContext
};
