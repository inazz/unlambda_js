
var tests = tests || {};
tests.unlambda = tests.unlambda || {};
tests.unlambda.parser = tests.unlambda.parser || {};


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
