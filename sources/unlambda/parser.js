

var unlambda = unlambda || {};
unlambda.parser = unlambda.parser || {};

unlambda.parser.ParseResult = function() {
  this.sucess = false;
  this.variable = null; // unlambda.Variable
  this.error = null; // unlambda.parser.ERROR
  this.error_pos = -1;
};

unlambda.parser.ERROR = {
  UNEXPECTED_CHARACTER: 1,
  UNEXPECTED_EOF: 2,
  EXTRA_CHARACTER: 3,
};

unlambda.parser.ParseContext = function(code) {
  this.code = code; // string
  this.cur = 0;
  this.end = code.length;
  this.variable = null; // unlambda.Variable
  this.error = null; // unlambda.parser.ERROR
};


// code -- string
// rturn unlambda.parser.Result
unlambda.parser.parse = function(code) {
  var ctx = new unlambda.parser.ParseContext(code);
  this.parse_(ctx);
  if (ctx.error === null) {
    ctx.cur = this.findEndOfComment(ctx.code, ctx.cur, ctx.end);
    if (ctx.cur != ctx.end) {
      ctx.error = unlambda.parser.ERROR.EXTRA_CHARACTER;
    }
  }
  var res = new unlambda.parser.ParseResult();
  res.success = (ctx.error === null);
  res.variable = ctx.variable;
  if (!res.success) {
    res.error = ctx.error;
    res.error_pos = ctx.cur;
  }
  return res;
};

// ctx -- unlambda.parser.ParseContext.
unlambda.parser.parse_ = function(ctx) {
  ctx.cur = this.findEndOfComment(ctx.code, ctx.cur, ctx.end);
  if (ctx.cur == ctx.end) {
    ctx.error = unlambda.parser.ERROR.UNEXPECTED_EOF;
    return;
  }
  var c = ctx.code.charAt(ctx.cur);
  if (c == "`") {
    ctx.cur++;
    this.parse_(ctx);
    if (ctx.error !== null)
      return;
    var v1 = ctx.variable;
    ctx.variable = null;
    this.parse_(ctx);
    if (ctx.error !== null)
      return;
    ctx.variable = new unlambda.Variable(c, v1, ctx.variable);
  } else if ("skivcde@|".indexOf(c) != -1) {
    ctx.variable = new unlambda.Variable(c, null, null);
    ctx.cur++;
  } else if (".?".indexOf(c) != -1) {
    if (ctx.cur + 1 == ctx.end) {
      ctx.error = unlambda.parser.ERROR.UNEXPECTED_EOF;
    } else {
      ctx.variable =
        new unlambda.Variable(c, ctx.code.charAt(ctx.cur + 1), null);
      ctx.cur += 2;
    }
  } else if (c == "r") {
    ctx.variable = new unlambda.Variable(".", "\n", null);
    ctx.cur++;
  } else {
    ctx.error = unlambda.parser.ERROR.UNEXPECTED_CHARACTER;
  }
};


// return first non-comment charactor position between 'start' and 'end' in
// 'code'.
// code -- string
// start -- int
// return -- int
unlambda.parser.findEndOfComment = function(code, start, end) {
  var cur = start;
  while (cur != end) {
    var c = code.charAt(cur);
    if (" \t\r\n".indexOf(c) != -1) {
      cur++;
    } else if (c == "#") {
      cur = code.indexOf("\n", cur+1);
      if (cur == -1 || cur > end) {
        cur = end;
      }
    } else {
      break; 
    }
  }
  return cur;
};
