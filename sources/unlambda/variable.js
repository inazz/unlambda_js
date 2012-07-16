

var unlambda = unlambda || {};

// op -- unlambda.OP
// v1 -- null or unlambda.Code
// v2 -- null or unlambda.Code
unlambda.Variable = function(op, v1, v2) {
  this.op = op;
  this.v1 = v1;
  this.v2 = v2;
};
