
var tests = tests || {};
tests.unlambda = tests.unlambda || {};
tests.unlambda.parser = tests.unlambda.parser || {};


tests.unlambda.parser.FindEndOfCommentTest = function() {};
registerTestSuite(tests.unlambda.parser.FindEndOfCommentTest);
tests.unlambda.parser.FindEndOfCommentTest.prototype.ReturnStartIfNotComment =
  function() {
    expectEq(0, unlambda.parser.findEndOfComment("` ii", 0));
    expectEq(2, unlambda.parser.findEndOfComment("` ii", 2));
    expectEq(4, unlambda.parser.findEndOfComment("` ii", 4));
  };

tests.unlambda.parser.FindEndOfCommentTest.prototype.SkipSpaces =
  function() {
    expectEq(7, unlambda.parser.findEndOfComment("`i \t \r\ni", 2));
    expectEq(7, unlambda.parser.findEndOfComment("`i \t \r\ni", 6));
  };

tests.unlambda.parser.FindEndOfCommentTest.prototype.SkipSharpUntilEoL =
  function() {
    expectEq(5, unlambda.parser.findEndOfComment("`i#?\ni", 2));
  };

tests.unlambda.parser.FindEndOfCommentTest.prototype.SkipSharpUntilEoF =
  function() {
    expectEq(5, unlambda.parser.findEndOfComment("`i#??", 2));
  };

tests.unlambda.parser.FindEndOfCommentTest.prototype.SkipMixture =
  function() {
    expectEq(15, unlambda.parser.findEndOfComment(
      "`ii #ii?\n \t# \n ii",3));
    expectEq(15, unlambda.parser.findEndOfComment(
      "`ii#\n#x\n \t# \n# ", 3));
  };
