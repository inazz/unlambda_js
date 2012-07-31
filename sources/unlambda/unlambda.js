
var unlambda = unlambda || {};

unlambda.Unlambda = function() {
};

unlambda.Unlambda.prototype.parse = function(code) {
  return unlambda.parser.parse(code);
};
unlambda.Unlambda.prototype.newContext = function(
  variable, inputCallback, outputCallback) {
  return new unlambda.runtime.RuntimeContext(
    variable, new unlambda.runtime.IO(inputCallback, outputCallback));
}
unlambda.Unlambda.prototype.run = function(ctx) {
  return unlambda.runtime.run(ctx);
};
