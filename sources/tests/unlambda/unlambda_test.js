
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

UnlambdaTest.prototype.Regression_ContinuationShouldNotHoldCurrentCharacter = function() {
  expectCall(this.iCallback)()
    .willOnce(returnWith("a"))
    .willOnce(returnWith("b"))
    .willOnce(returnWith("c"));
  expectCall(this.oCallback)("a").times(1);
  expectCall(this.oCallback)("b").times(1);
  
  var variable = this.unl.parse("``c`@i```|i@i").variable;
  var ctx = this.unl.newContext(variable, this.iCallback, this.oCallback);

  this.unl.run(ctx);
  expectEq(unlambda.runtime.STATE.EXITED, ctx.state);
};

