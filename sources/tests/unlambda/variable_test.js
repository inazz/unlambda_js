
function UnlambdaVariableTest(){}
registerTestSuite(UnlambdaVariableTest);

UnlambdaVariableTest.prototype.DifferentObjectDifferentId = function() {
  var var1 = new unlambda.Variable(unlambda.OP.I, null, null);
  var var2 = new unlambda.Variable(unlambda.OP.I, null, null);
  var var3 = new unlambda.Variable(unlambda.OP.I, null, null);

  expectNe(var1.id, var2.id);
  expectNe(var1.id, var3.id);
  expectNe(var2.id, var3.id);
};
