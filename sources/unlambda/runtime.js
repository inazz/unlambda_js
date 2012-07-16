

var unlambda = unlambda || {};
unlambda.runtime = unlambda.runtime || {};

// inputCallback is a function take no argument and return string.
// it will be called when '@' is called.
// it should return single character string to give next input character,
// unlambda.runtime.IO_CODE.EOF when EOF, or BLOCK when input is blocking.
// when the input is bloked.
//
// outputCallback is a function take one character string.
// it will be called when '.x' is called.
unlambda.runtime.IO = function(inputCallback, outputCallback) {
  this.input = inputCallback; // function(): string
  this.output = outputCallback; // function(string)
};

unlambda.runtime.IO_CODE = {
  EOF: '',
  BLOCK: 'BL',
};

unlambda.runtime.STATE = {
  RUNNING: 0,
  EXITED: 1,
  INPUT_WAIT: 2,
  STEP_LIMIT: 3,
};

// variable -- unlambda.Variable
unlambda.runtime.RuntimeContext = function(variable, io) {
  this.original_variable = variable; // unlambda.Variable
  this.variable = variable; // unlambda.Variable
  this.io = io; // unlambda.runtime.IO
  // -1 for no read yet or EOF. valid value is 0-255.
  this.current_character = unlambda.runtime.IO_CODE.EOF; // string
  this.step = 0; // int
  this.step_limit = -1; // int
  this.state = unlambda.runtime.STATE.RUNNING;
  // for temporary use while run().
  this.current_variable = null;
  this.exit_arg = null;
};

// ctx -- unlambda.runtime.RuntimeContext
unlambda.runtime.run = function(ctx) {
  if (ctx.state == unlambda.runtime.STATE.EXITED) {
    return;
  }
  ctx.current_variable = ctx.variable;
  ctx.state = unlambda.runtime.STATE.RUNNING;
  this.eval_(ctx);
  ctx.variable = ctx.current_variable;
  if (ctx.state == unlambda.runtime.STATE.EXITED) {
    ctx.variable = ctx.exit_arg;
  }
  if (ctx.state == unlambda.runtime.STATE.RUNNING) {
    ctx.state = unlambda.runtime.STATE.EXITED;
  }
};

unlambda.runtime.eval_ = function(ctx) {
  var cur = ctx.current_variable;
  if (cur.op != unlambda.OP.APPLY) {
    return;
  }
  ctx.current_variable = cur.v1;
  this.eval_(ctx);
  var v1 = ctx.current_variable;
  if (ctx.state != unlambda.runtime.STATE.RUNNING) {
    ctx.current_variable = new unlambda.Variable(cur.op, v1, cur.v2);
    return;
  }
  // TODO(inazz): implement D here.
  ctx.current_variable = cur.v2;
  this.eval_(ctx);
  var v2 = ctx.current_variable;
  if (ctx.state != unlambda.runtime.STATE.RUNNING) {
    ctx.current_variable = new unlambda.Variable(cur.op, v1, v2);
    return;
  }
  if (ctx.step == ctx.step_limit) {
    ctx.current_variable = new unlambda.Variable(cur.op, v1, v2);
    ctx.state = unlambda.runtime.STATE.STEP_LIMIT;
    return;
  }
  ctx.step++;
  var applyFunc = this.FUNC_TABLE[v1.op];
  applyFunc.call(this, ctx, v1, v2);
};

unlambda.runtime.applyI = function(ctx, f, x) {
  ctx.current_variable = x;
};
unlambda.runtime.applyV = function(ctx, f, x) {
  ctx.current_variable = f;
};
unlambda.runtime.applyK = function(ctx, f, x) {
  ctx.current_variable = new unlambda.Variable(unlambda.OP.K1, x, null);
};
unlambda.runtime.applyK1 = function(ctx, f, x) {
  ctx.current_variable = f.v1;
};
unlambda.runtime.applyS = function(ctx, f, x) {
  ctx.current_variable = new unlambda.Variable(unlambda.OP.S1, x, null);
};
unlambda.runtime.applyS1 = function(ctx, f, x) {
  ctx.current_variable = new unlambda.Variable(unlambda.OP.S2, f.v1, x);
};
unlambda.runtime.applyS2 = function(ctx, f, x) {
  ctx.current_variable = new unlambda.Variable(
    unlambda.OP.APPLY,
    new unlambda.Variable(unlambda.OP.APPLY, f.v1, x),
    new unlambda.Variable(unlambda.OP.APPLY, f.v2, x));
  this.eval_(ctx);
};
unlambda.runtime.applyPrint = function(ctx, f, x) {
  ctx.io.output(f.v1);
  ctx.current_variable = x;
};
unlambda.runtime.applyRead = function(ctx, f, x) {
  var s = ctx.io.input();
  if (s == unlambda.runtime.IO_CODE.BLOCK) {
    ctx.step--;
    ctx.current_variable = new unlambda.Variable(unlambda.OP.APPLY, f, x);
    ctx.state = unlambda.runtime.STATE.INPUT_WAIT;
  } else if (s == unlambda.runtime.IO_CODE.EOF) {
    ctx.current_character = s;
    ctx.current_variable = new unlambda.Variable(
      unlambda.OP.APPLY, x, new unlambda.Variable(unlambda.OP.V, null, null));
    this.eval_(ctx);
  } else {
    ctx.current_character = s;
    ctx.current_variable = new unlambda.Variable(
      unlambda.OP.APPLY, x, new unlambda.Variable(unlambda.OP.I, null, null));
    this.eval_(ctx);
  }
};
unlambda.runtime.applyExit = function(ctx, f, x) {
  ctx.state = unlambda.runtime.STATE.EXITED;
  ctx.exit_arg = x;
  ctx.current_variable = new unlambda.Variable(unlambda.OP.V, null, null);
};
unlambda.runtime.applyReprint = function(ctx, f, x) {
  var varArg;
  if (ctx.current_character == unlambda.runtime.IO_CODE.EOF) {
    varArg = new unlambda.Variable(unlambda.OP.V, null, null);
  } else {
    varArg = new unlambda.Variable(
      unlambda.OP.PRINT, ctx.current_character, null);
  }
  ctx.current_variable = new unlambda.Variable(unlambda.OP.APPLY, x, varArg);
  this.eval_(ctx);
};
unlambda.runtime.applyCompare = function(ctx, f, x) {
  var varArg;
  if (ctx.current_character == f.v1) {
    varArg = new unlambda.Variable(unlambda.OP.I, null, null);
  } else {
    varArg = new unlambda.Variable(unlambda.OP.V, null, null);
  }
  ctx.current_variable = new unlambda.Variable(unlambda.OP.APPLY, x, varArg);
  this.eval_(ctx);
};

unlambda.runtime.FUNC_TABLE = {};
unlambda.runtime.FUNC_TABLE[unlambda.OP.I] = unlambda.runtime.applyI;
unlambda.runtime.FUNC_TABLE[unlambda.OP.V] = unlambda.runtime.applyV;
unlambda.runtime.FUNC_TABLE[unlambda.OP.K] = unlambda.runtime.applyK;
unlambda.runtime.FUNC_TABLE[unlambda.OP.K1] = unlambda.runtime.applyK1;
unlambda.runtime.FUNC_TABLE[unlambda.OP.S] = unlambda.runtime.applyS;
unlambda.runtime.FUNC_TABLE[unlambda.OP.S1] = unlambda.runtime.applyS1;
unlambda.runtime.FUNC_TABLE[unlambda.OP.S2] = unlambda.runtime.applyS2;
unlambda.runtime.FUNC_TABLE[unlambda.OP.PRINT] = unlambda.runtime.applyPrint;
unlambda.runtime.FUNC_TABLE[unlambda.OP.READ] = unlambda.runtime.applyRead;
unlambda.runtime.FUNC_TABLE[unlambda.OP.E] = unlambda.runtime.applyExit;
unlambda.runtime.FUNC_TABLE[unlambda.OP.REPRINT] = unlambda.runtime.applyReprint;
unlambda.runtime.FUNC_TABLE[unlambda.OP.COMPARE] = unlambda.runtime.applyCompare;