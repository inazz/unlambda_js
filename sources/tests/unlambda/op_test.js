
var tests = tests || {};
tests.unlambda = tests.unlambda || {};
tests.unlambda.OpTest = function() {};
registerTestSuite(tests.unlambda.OpTest);

tests.unlambda.OpTest.prototype.OpContainsKeywordsOtherThanR = function() {
  var keywords = '`ksivcde@|.?';
  for (var i = 0; i < keywords.length; i++) {
    var keyword = keywords.charAt(i);
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
