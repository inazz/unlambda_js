
function UnlambdaTest() {
  this.unl = new unlambda.Unlambda();
  this.iCallback = createMockFunction();
  this.oCallback = createMockFunction();
};
registerTestSuite(UnlambdaTest);

UnlambdaTest.prototype.Integration = function() {
  expectCall(this.iCallback)().willOnce(returnWith("a"));
  expectCall(this.oCallback)("a").times(1);
  
  var variable = this.unl.parse("``|``@iii").variable;
  var ctx = this.unl.newContext(variable, this.iCallback, this.oCallback);
  this.unl.run(ctx);

  expectEq(this.unl.parse("i").variable, ctx.variable);
  expectEq(unlambda.runtime.STATE.EXITED, ctx.state);
};

