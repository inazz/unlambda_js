
function UnlambdaRuntimeRunTest() {
  this.input_array = [];
  this.input_index = 0;
  this.output_string = '';
  this.io = new unlambda.runtime.IO(
    function(that) {
      return function() {
        if (that.input_index < that.input_array.length) {
          return that.input_array[that.input_index++];
        } else {
          return -1;
        }
      };}(this),
    function(that) {
      return function(c) {
        that.output_string += c;
      };}(this));
};
registerTestSuite(UnlambdaRuntimeRunTest);

UnlambdaRuntimeRunTest.prototype.VariableJustExited = function() {
  var varI = unlambda.parser.parse('i').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varI, this.io);
  unlambda.runtime.run(ctx);
  expectEq(0, ctx.step);
  expectEq(unlambda.runtime.STATE.EXITED, ctx.state);
  expectEq(varI, ctx.variable);
};

UnlambdaRuntimeRunTest.prototype.I = function() {
  var varIS = unlambda.parser.parse('`is').variable;
  var varS = unlambda.parser.parse('s').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varIS, this.io);
  unlambda.runtime.run(ctx);
  expectEq(1, ctx.step);
  expectEq(unlambda.runtime.STATE.EXITED, ctx.state);
  expectEq(varS, ctx.variable);
};

UnlambdaRuntimeRunTest.prototype.K = function() {
  var varKIV = unlambda.parser.parse('``kiv').variable;
  var varI = unlambda.parser.parse('i').variable;
  var varK1IV = new unlambda.Variable(
    unlambda.OP.APPLY,
    new unlambda.Variable(unlambda.OP.K1, varI, null),
    new unlambda.Variable(unlambda.OP.V, null, null));
  var ctx = new unlambda.runtime.RuntimeContext(varKIV, this.io);

  ctx.step_limit = 1;
  unlambda.runtime.run(ctx);
  expectEq(1, ctx.step);
  expectEq(unlambda.runtime.STATE.STEP_LIMIT, ctx.state);
  expectEq(varK1IV, ctx.variable);

  ctx.step_limit = -1;
  unlambda.runtime.run(ctx);
  expectEq(2, ctx.step);
  expectEq(unlambda.runtime.STATE.EXITED, ctx.state);
  expectEq(varI, ctx.variable);
};

UnlambdaRuntimeRunTest.prototype.S = function() {
  var varSKVI = unlambda.parser.parse('```skvi').variable;
  var varK = unlambda.parser.parse('k').variable;
  var varV = unlambda.parser.parse('v').variable;
  var varI = unlambda.parser.parse('i').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varSKVI, this.io);

  ctx.step_limit = 1;
  unlambda.runtime.run(ctx);
  var varS1KVI = new unlambda.Variable(
    unlambda.OP.APPLY, 
    new unlambda.Variable(
      unlambda.OP.APPLY,
      new unlambda.Variable(unlambda.OP.S1, varK, null), varV),
    varI);
  expectEq(varS1KVI, ctx.variable);

  ctx.step_limit = 2;
  unlambda.runtime.run(ctx);
  var varS2KVI = new unlambda.Variable(
    unlambda.OP.APPLY, 
    new unlambda.Variable(unlambda.OP.S2, varK, varV),
    varI);
  expectEq(varS2KVI, ctx.variable);

  ctx.step_limit = 3;
  unlambda.runtime.run(ctx);
  var varS2KVI = new unlambda.Variable(
    unlambda.OP.APPLY,
    new unlambda.Variable(unlambda.OP.APPLY, varK, varI),
    new unlambda.Variable(unlambda.OP.APPLY, varV, varI));
  expectEq(varS2KVI, ctx.variable);

  ctx.step_limit = -1;
  unlambda.runtime.run(ctx);
  expectEq(6, ctx.step);
  expectEq(unlambda.runtime.STATE.EXITED, ctx.state);
  expectEq(varI, ctx.variable);
};

UnlambdaRuntimeRunTest.prototype.Print = function() {
  var varPxS = unlambda.parser.parse('`.xs').variable;
  var varS = unlambda.parser.parse('s').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varPxS, this.io);
  unlambda.runtime.run(ctx);
  expectEq(1, ctx.step);
  expectEq(unlambda.runtime.STATE.EXITED, ctx.state);
  expectEq(varS, ctx.variable);
  expectEq('x', this.output_string);
};
