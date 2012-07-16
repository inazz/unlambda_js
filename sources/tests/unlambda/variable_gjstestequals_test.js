
function UnlambdaVariableGjstestequalsTest() {}
registerTestSuite(UnlambdaVariableGjstestequalsTest);

UnlambdaVariableGjstestequalsTest.prototype.GjstestEquals = function() {
  var variableI = new unlambda.Variable(unlambda.OP.I, null, null);
  var variableI2 = new unlambda.Variable(unlambda.OP.I, null, null);
  var variablePrintA = new unlambda.Variable(unlambda.OP.PRINT, 'a', null);
  var variablePrintA2 = new unlambda.Variable(unlambda.OP.PRINT, 'a', null);
  var variableApply1 = new unlambda.Variable(
    unlambda.OP.APPLY, variablePrintA, variableI);
  var variableApply2 = new unlambda.Variable(
    unlambda.OP.APPLY, variablePrintA2, variableI2);
  var variableApply3 = new unlambda.Variable(
    unlambda.OP.APPLY, variableI, variableI2);

  expectFalse(variableI.gjstestEquals(null));
  expectFalse(variableI.gjstestEquals('i'));

  expectTrue(variableI.gjstestEquals(variableI));
  expectTrue(variableI.gjstestEquals(variableI2));
  expectFalse(variableI.gjstestEquals(variablePrintA));
  expectFalse(variableI.gjstestEquals(variableApply3));

  expectFalse(variablePrintA.gjstestEquals(variableI));
  expectTrue(variablePrintA.gjstestEquals(variablePrintA2));
  expectFalse(variablePrintA.gjstestEquals(variableApply1));

  expectTrue(variableApply1.gjstestEquals(variableApply1));
  expectTrue(variableApply1.gjstestEquals(variableApply2));
  expectFalse(variableApply1.gjstestEquals(variableApply3));
};
