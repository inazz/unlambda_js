
var tests = tests || {};
tests.unlambda = tests.unlambda || {};
tests.unlambda.parser = tests.unlambda.parser || {};

tests.unlambda.parser.ParseTest = function() {
  this.checkParseSuccess = function(code, expectedVariable) {
    var res = unlambda.parser.parse(code);
    expectTrue(res.success);
    expectThat(res.error, isNull);
    expectThat(res.variable, equals(expectedVariable));
  };
};
registerTestSuite(tests.unlambda.parser.ParseTest);
tests.unlambda.parser.ParseTest.prototype.Primitives = function() {
  this.checkParseSuccess(
    's', new unlambda.Variable(unlambda.OP.S, null, null));
  this.checkParseSuccess(
    'k', new unlambda.Variable(unlambda.OP.K, null, null));
  this.checkParseSuccess(
    'i', new unlambda.Variable(unlambda.OP.I, null, null));
  this.checkParseSuccess(
    'v', new unlambda.Variable(unlambda.OP.V, null, null));
  this.checkParseSuccess(
    'c', new unlambda.Variable(unlambda.OP.C, null, null));
  this.checkParseSuccess(
    'd', new unlambda.Variable(unlambda.OP.D, null, null));
  this.checkParseSuccess(
    '.a', new unlambda.Variable(unlambda.OP.PRINT, 'a', null));
  this.checkParseSuccess(
    'e', new unlambda.Variable(unlambda.OP.E, null, null));
  this.checkParseSuccess(
    '@', new unlambda.Variable(unlambda.OP.READ, null, null));
  this.checkParseSuccess(
    '?a', new unlambda.Variable(unlambda.OP.COMPARE, 'a', null));
  this.checkParseSuccess(
    '|', new unlambda.Variable(unlambda.OP.REPRINT, null, null));
  this.checkParseSuccess(
    'r', new unlambda.Variable(unlambda.OP.PRINT, "\n", null));
};
tests.unlambda.parser.ParseTest.prototype.TwoCharCornerCases = function() {
  this.checkParseSuccess(
    ".#", new unlambda.Variable(unlambda.OP.PRINT, '#', null));
  this.checkParseSuccess(
    ". ", new unlambda.Variable(unlambda.OP.PRINT, ' ', null));
  this.checkParseSuccess(
    ".\n", new unlambda.Variable(unlambda.OP.PRINT, "\n", null));
  this.checkParseSuccess(
    "?#", new unlambda.Variable(unlambda.OP.COMPARE, '#', null));
  this.checkParseSuccess(
    "? ", new unlambda.Variable(unlambda.OP.COMPARE, ' ', null));
  this.checkParseSuccess(
    "?\n", new unlambda.Variable(unlambda.OP.COMPARE, "\n", null));
};
tests.unlambda.parser.ParseTest.prototype.Apply = function() {
  this.checkParseSuccess(
    "`i`vk",
    new unlambda.Variable(
      unlambda.OP.APPLY,
      new unlambda.Variable(unlambda.OP.I, null, null),
      new unlambda.Variable(
        unlambda.OP.APPLY,
        new unlambda.Variable(unlambda.OP.V, null, null),
        new unlambda.Variable(unlambda.OP.K, null, null))));
};
tests.unlambda.parser.ParseTest.prototype.CommendsAreIgnored = function() {
  this.checkParseSuccess(
    "  `i #test\nv\n",
    new unlambda.Variable(
      unlambda.OP.APPLY,
      new unlambda.Variable(unlambda.OP.I, null, null),
      new unlambda.Variable(unlambda.OP.V, null, null)));
};
tests.unlambda.parser.ParseTest.prototype.ExtraCharacter = function() {
  var res = unlambda.parser.parse('`iiv');
  expectFalse(res.success);
  expectEq(unlambda.parser.ERROR.EXTRA_CHARACTER, res.error);
  expectEq(3, res.error_pos);
};
tests.unlambda.parser.ParseTest.prototype.UnexpectedCharacter = function() {
  var res = unlambda.parser.parse('``ihi');
  expectFalse(res.success);
  expectEq(unlambda.parser.ERROR.UNEXPECTED_CHARACTER, res.error);
  expectEq(3, res.error_pos);
};
tests.unlambda.parser.ParseTest.prototype.UnexpectedEOF = function() {
  var res = unlambda.parser.parse('');
  expectFalse(res.success);
  expectEq(unlambda.parser.ERROR.UNEXPECTED_EOF, res.error);
  expectEq(0, res.error_pos);

  res = unlambda.parser.parse('`');
  expectFalse(res.success);
  expectEq(unlambda.parser.ERROR.UNEXPECTED_EOF, res.error);
  expectEq(1, res.error_pos);

  res = unlambda.parser.parse('`i');
  expectFalse(res.success);
  expectEq(unlambda.parser.ERROR.UNEXPECTED_EOF, res.error);
  expectEq(2, res.error_pos);

  res = unlambda.parser.parse('`i.');
  expectFalse(res.success);
  expectEq(unlambda.parser.ERROR.UNEXPECTED_EOF, res.error);
  expectEq(2, res.error_pos);

  res = unlambda.parser.parse('`i?');
  expectFalse(res.success);
  expectEq(unlambda.parser.ERROR.UNEXPECTED_EOF, res.error);
  expectEq(2, res.error_pos);
};




tests.unlambda.parser.FindEndOfCommentTest = function() {};
registerTestSuite(tests.unlambda.parser.FindEndOfCommentTest);
tests.unlambda.parser.FindEndOfCommentTest.prototype.ReturnStartIfNotComment =
  function() {
    var code = '` ii';
    expectEq(0, unlambda.parser.findEndOfComment(code, 0, code.length));
    expectEq(2, unlambda.parser.findEndOfComment(code, 2, code.length));
    expectEq(4, unlambda.parser.findEndOfComment(code, 4, code.length));
  };

tests.unlambda.parser.FindEndOfCommentTest.prototype.SkipSpaces =
  function() {
    var code = "`i \t \r\ni";
    expectEq(7, unlambda.parser.findEndOfComment(code, 2, code.length));
    expectEq(7, unlambda.parser.findEndOfComment(code, 6, code.length));
  };

tests.unlambda.parser.FindEndOfCommentTest.prototype.SkipSharpUntilEoL =
  function() {
    var code = "`i#?\ni";
    expectEq(5, unlambda.parser.findEndOfComment(code, 2, code.length));
  };

tests.unlambda.parser.FindEndOfCommentTest.prototype.SkipSharpUntilEoF =
  function() {
    var code = "`i#??";
    expectEq(5, unlambda.parser.findEndOfComment(code, 2, code.length));
  };

tests.unlambda.parser.FindEndOfCommentTest.prototype.SkipMixture =
  function() {
    var code1 = "`ii #ii?\n \t# \n ii";
    var code2 = "`ii#\n#x\n \t# \n# ";
    expectEq(15, unlambda.parser.findEndOfComment(code1, 3, code1.length));
    expectEq(15, unlambda.parser.findEndOfComment(code2, 3, code2.length));
  };

tests.unlambda.parser.FindEndOfCommentTest.prototype.StopAtGivenEnd =
  function() {
    var code1 = "`         ii";
    var code2 = "`#        \nii";
    expectEq(5, unlambda.parser.findEndOfComment(code1, 1, 5));
    expectEq(5, unlambda.parser.findEndOfComment(code2, 1, 5));
  };
