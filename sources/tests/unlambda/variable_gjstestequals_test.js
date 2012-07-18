
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

UnlambdaVariableGjstestequalsTest.prototype.GjstestEqualsLoop = function() {
  var variableC1 = new unlambda.Variable(unlambda.OP.C1, null, 'x');
  var variableC12 = new unlambda.Variable(unlambda.OP.C1, null, 'x');
  var variableC13 = new unlambda.Variable(unlambda.OP.C1, null, 'x');
  var variableI = new unlambda.Variable(unlambda.OP.I, null, null);
  var variableI2 = new unlambda.Variable(unlambda.OP.I, null, null);
  var variableV = new unlambda.Variable(unlambda.OP.V, null, null);
  var variableApply1 = new unlambda.Variable(
    unlambda.OP.APPLY, variableC1, variableI);
  variableC1.v1 = variableApply1;
  var variableApply2 = new unlambda.Variable(
    unlambda.OP.APPLY, variableC12, variableI2);
  variableC12.v1 = variableApply2;

  expectTrue(variableApply1.gjstestEquals(variableApply2));

  variableC12.v2 = 'y';
  expectFalse(variableApply1.gjstestEquals(variableApply2));
  variableC12.v2 = 'x';

  variableApply2.v2 = variableV;
  expectFalse(variableApply1.gjstestEquals(variableApply2));
  variableApply2.v2 = variableI2;
};
