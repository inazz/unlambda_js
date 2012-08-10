
function UnlambdaAppAppContextTest() {
  this.ctx = new unlambda_app.AppContext();
}
registerTestSuite(UnlambdaAppAppContextTest);

UnlambdaAppAppContextTest.prototype.GetCurrentStep = function() {
  this.ctx.run_state = unlambda_app.RUN_STATE.RUNNING;
  this.ctx.runtime_context = {};
  this.ctx.runtime_context.step = 20;
  expectEq(20, this.ctx.getCurrentStep());
};

UnlambdaAppAppContextTest.prototype.GetCurrentStepWhenStopped = function() {
  this.ctx.run_state = unlambda_app.RUN_STATE.STOPPED;
  this.ctx.runtime_context = {};
  this.ctx.runtime_context.step = 20;
  expectEq(0, this.ctx.getCurrentStep());
};
