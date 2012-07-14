
var tests = tests || {};
tests.unlambda = tests.unlambda || {};
tests.unlambda.OpTest = function() {};
registerTestSuite(tests.unlambda.OpTest);

tests.unlambda.OpTest.prototype.OpContainsAllOneCharKeywords = function() {
  var one_char_keywords = '`ksivcde@|';
  for (var i = 0; i < one_char_keywords.length; i++) {
    var keyword = one_char_keywords.charAt(i);
    var found = false;
    for (keys in unlambda.OP) {
      if (unlambda.OP[keys] === keyword) {
        found = true;
        break;
      }
    }
    expectTrue(found);
  }
};
