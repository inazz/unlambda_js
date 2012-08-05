
function UnlambdaAppAppContextTest() {
  this.ctx = new unlambda_app.AppContext();
}
registerTestSuite(UnlambdaAppAppContextTest);

UnlambdaAppAppContextTest.prototype.GetCurrentStep = function() {
  expectEq(0, this.ctx.getCurrentStep());

  this.ctx.runtime_context = {};
  this.ctx.runtime_context.step = 20;
  expectEq(20, this.ctx.getCurrentStep());
};
