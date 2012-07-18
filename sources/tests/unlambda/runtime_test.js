
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
          return unlambda.runtime.IO_CODE.EOF;
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
  var ctx = new unlambda.runtime.RuntimeContext(varKIV, this.io);
  unlambda.runtime.run(ctx);
  expectEq(2, ctx.step);
  expectEq(unlambda.runtime.STATE.EXITED, ctx.state);
  expectEq(varI, ctx.variable);
};

UnlambdaRuntimeRunTest.prototype.KStep = function() {
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
  var varI = unlambda.parser.parse('i').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varSKVI, this.io);
  unlambda.runtime.run(ctx);
  expectEq(6, ctx.step);
  expectEq(unlambda.runtime.STATE.EXITED, ctx.state);
  expectEq(varI, ctx.variable);
};

UnlambdaRuntimeRunTest.prototype.SStep = function() {
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

UnlambdaRuntimeRunTest.prototype.C = function() {
  var varTest = unlambda.parser.parse('``c@i').variable;
  var varI = unlambda.parser.parse('i').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varTest, this.io);

  ctx.current_character = 'x';
  this.input_array = [ 'y' ];
  ctx.step_limit = -1;
  unlambda.runtime.run(ctx);
  expectEq(unlambda.runtime.STATE.EXITED, ctx.state);
  expectEq(4, ctx.step);
  expectEq('x', ctx.current_character);
  expectEq(varI, ctx.variable);
};

UnlambdaRuntimeRunTest.prototype.CStep = function() {
  var varTest = unlambda.parser.parse('``c@i').variable;
  var varI = unlambda.parser.parse('i').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varTest, this.io);

  ctx.current_character = 'x';
  this.input_array = [ 'y' ];

  ctx.step_limit = 1;
  unlambda.runtime.run(ctx);
  expectEq(unlambda.runtime.STATE.STEP_LIMIT, ctx.state);
  var varExpect = unlambda.parser.parse('``@ci').variable;
  var varC1 = new unlambda.Variable(unlambda.OP.C1, varExpect, 'x');
  varExpect.v1.v2 = varC1;
  expectEq(varExpect, ctx.variable);
  expectEq('x', ctx.current_character);

  ctx.step_limit = 2;
  unlambda.runtime.run(ctx);
  expectEq(unlambda.runtime.STATE.STEP_LIMIT, ctx.state);
  expectEq('y', ctx.current_character);

  ctx.step_limit = 3;
  unlambda.runtime.run(ctx);
  expectEq(unlambda.runtime.STATE.STEP_LIMIT, ctx.state);
  expectEq(unlambda.parser.parse('`ii').variable, ctx.variable);
  expectEq('x', ctx.current_character);
};

UnlambdaRuntimeRunTest.prototype.D = function() {
  var varTest = unlambda.parser.parse('``d`.2.3`.1`d`.xi').variable;
  var varPxI = unlambda.parser.parse('`.xi').variable;
  var varExpected = new unlambda.Variable(unlambda.OP.D1, varPxI, null);
  var ctx = new unlambda.runtime.RuntimeContext(varTest, this.io);
  unlambda.runtime.run(ctx);

  expectEq(6, ctx.step);
  expectEq(unlambda.runtime.STATE.EXITED, ctx.state);
  expectEq('123', this.output_string);
  expectEq(varExpected, ctx.variable);
};

UnlambdaRuntimeRunTest.prototype.DStep = function() {
  var varDKIVI = unlambda.parser.parse('``d`ki`vi').variable;
  var varK = unlambda.parser.parse('k').variable;
  var varI = unlambda.parser.parse('i').variable;
  var varV = unlambda.parser.parse('v').variable;
  var varVI = unlambda.parser.parse('`vi').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varDKIVI, this.io);

  ctx.step_limit = 1;
  unlambda.runtime.run(ctx);
  var varD1KIVI = new unlambda.Variable(
    unlambda.OP.APPLY, 
    new unlambda.Variable(
      unlambda.OP.D1,
      new unlambda.Variable(unlambda.OP.APPLY, varK, varI), null),
    varVI);
  expectEq(varD1KIVI, ctx.variable);

  ctx.step_limit = 2;
  unlambda.runtime.run(ctx);
  var varD1KIV = new unlambda.Variable(
    unlambda.OP.APPLY, 
    new unlambda.Variable(
      unlambda.OP.D1,
      new unlambda.Variable(unlambda.OP.APPLY, varK, varI), null),
    varV);
  expectEq(varD1KIV, ctx.variable);

  ctx.step_limit = 3;
  unlambda.runtime.run(ctx);
  var varKIV = new unlambda.Variable(
    unlambda.OP.APPLY, 
    new unlambda.Variable(unlambda.OP.APPLY, varK, varI), varV);
  expectEq(varKIV, ctx.variable);

  ctx.step_limit = 4;
  unlambda.runtime.run(ctx);
  var varK1IV = new unlambda.Variable(
    unlambda.OP.APPLY, 
    new unlambda.Variable(unlambda.OP.K1, varI, null), varV);
  expectEq(varK1IV, ctx.variable);
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

UnlambdaRuntimeRunTest.prototype.ReadChar = function() {
  var varRI = unlambda.parser.parse('`@i').variable;
  var varI = unlambda.parser.parse('i').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varRI, this.io);

  this.input_array = [ 'x' ];
  unlambda.runtime.run(ctx);

  expectEq(2, ctx.step);
  expectEq(unlambda.runtime.STATE.EXITED, ctx.state);
  expectEq(varI, ctx.variable);
  expectEq('x', ctx.current_character);
};

UnlambdaRuntimeRunTest.prototype.ReadCharStep = function() {
  var varRK = unlambda.parser.parse('`@k').variable;
  var varKI = unlambda.parser.parse('`ki').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varRK, this.io);

  this.input_array = [ 'x' ];
  ctx.step_limit = 1;
  unlambda.runtime.run(ctx);
  expectEq(varKI, ctx.variable);
  expectEq('x', ctx.current_character);
};

UnlambdaRuntimeRunTest.prototype.ReadEOF = function() {
  var varRI = unlambda.parser.parse('`@i').variable;
  var varV = unlambda.parser.parse('v').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varRI, this.io);

  this.input_array = [];
  unlambda.runtime.run(ctx);

  expectEq(2, ctx.step);
  expectEq(unlambda.runtime.STATE.EXITED, ctx.state);
  expectEq(varV, ctx.variable);
  expectEq(unlambda.runtime.IO_CODE.EOF, ctx.current_character);
};

UnlambdaRuntimeRunTest.prototype.ReadEOFStep = function() {
  var varRK = unlambda.parser.parse('`@k').variable;
  var varKV = unlambda.parser.parse('`kv').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varRK, this.io);

  this.input_array = [];
  ctx.step_limit = 1;
  unlambda.runtime.run(ctx);

  expectEq(varKV, ctx.variable);
  expectEq(unlambda.runtime.IO_CODE.EOF, ctx.current_character);
};

UnlambdaRuntimeRunTest.prototype.ReadBlock = function() {
  var varRK = unlambda.parser.parse('`@k').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varRK, this.io);

  this.input_array = [ unlambda.runtime.IO_CODE.BLOCK ];
  ctx.step_limit = 1;
  unlambda.runtime.run(ctx);

  expectEq(unlambda.runtime.STATE.INPUT_WAIT, ctx.state);
  expectEq(0, ctx.step);
  expectEq(varRK, ctx.variable);
  expectEq(unlambda.runtime.IO_CODE.EOF, ctx.current_character);
};

UnlambdaRuntimeRunTest.prototype.Exit = function() {
  var varKES = unlambda.parser.parse('`k`es').variable;
  var varS = unlambda.parser.parse('s').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varKES, this.io);

  unlambda.runtime.run(ctx);

  expectEq(unlambda.runtime.STATE.EXITED, ctx.state);
  expectEq(1, ctx.step);
  expectEq(varS, ctx.variable);
};

UnlambdaRuntimeRunTest.prototype.ReprintChar = function() {
  var varRepI = unlambda.parser.parse('`|i').variable;
  var varPSp = unlambda.parser.parse('. ').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varRepI, this.io);

  ctx.current_character = ' ';
  unlambda.runtime.run(ctx);

  expectEq(2, ctx.step);
  expectEq(varPSp, ctx.variable);
};

UnlambdaRuntimeRunTest.prototype.ReprintCharStep = function() {
  var varRepK = unlambda.parser.parse('`|k').variable;
  var varKPSp = unlambda.parser.parse('`k. ').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varRepK, this.io);

  ctx.current_character = ' ';
  ctx.step_limit = 1;
  unlambda.runtime.run(ctx);

  expectEq(1, ctx.step);
  expectEq(varKPSp, ctx.variable);
};

UnlambdaRuntimeRunTest.prototype.ReprintEOF = function() {
  var varRepI = unlambda.parser.parse('`|i').variable;
  var varV = unlambda.parser.parse('v').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varRepI, this.io);

  unlambda.runtime.run(ctx);

  expectEq(2, ctx.step);
  expectEq(varV, ctx.variable);
};

UnlambdaRuntimeRunTest.prototype.ReprintEOFStep = function() {
  var varPK = unlambda.parser.parse('`|k').variable;
  var varKV = unlambda.parser.parse('`kv').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varPK, this.io);

  ctx.step_limit = 1;
  unlambda.runtime.run(ctx);

  expectEq(1, ctx.step);
  expectEq(varKV, ctx.variable);
};

UnlambdaRuntimeRunTest.prototype.CompareMatch = function() {
  var varCxI = unlambda.parser.parse('`?xi').variable;
  var varI = unlambda.parser.parse('i').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varCxI, this.io);

  ctx.current_character = 'x';
  unlambda.runtime.run(ctx);

  expectEq(2, ctx.step);
  expectEq(varI, ctx.variable);
};

UnlambdaRuntimeRunTest.prototype.CompareMatchStep = function() {
  var varCxS = unlambda.parser.parse('`?xs').variable;
  var varSI = unlambda.parser.parse('`si').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varCxS, this.io);

  ctx.step_limit = 1;
  ctx.current_character = 'x';
  unlambda.runtime.run(ctx);

  expectEq(1, ctx.step);
  expectEq(varSI, ctx.variable);
};

UnlambdaRuntimeRunTest.prototype.CompareFail = function() {
  var varCxI = unlambda.parser.parse('`?xi').variable;
  var varV = unlambda.parser.parse('v').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varCxI, this.io);

  ctx.current_character = '';
  unlambda.runtime.run(ctx);

  expectEq(2, ctx.step);
  expectEq(varV, ctx.variable);
};

UnlambdaRuntimeRunTest.prototype.CompareFailStep = function() {
  var varCxI = unlambda.parser.parse('`?xi').variable;
  var varIV = unlambda.parser.parse('`iv').variable;
  var ctx = new unlambda.runtime.RuntimeContext(varCxI, this.io);

  ctx.step_limit = 1;
  ctx.current_character = 'y';
  unlambda.runtime.run(ctx);

  expectEq(1, ctx.step);
  expectEq(varIV, ctx.variable);
};
