

var unlambda = unlambda || {};

// op -- unlambda.OP
// v1 -- null or unlambda.Code
// v2 -- null or unlambda.Code
unlambda.Variable = function(op, v1, v2) {
  this.op = op;
  this.v1 = v1;
  this.v2 = v2;
};

unlambda.Variable.prototype.gjstestEquals = function(rhs) {
  if (rhs === null || !(rhs instanceof Object) ||
      this.constructor != rhs.constructor)
    return false;
  if (this.op != rhs.op)
    return false;
  var v1res = false
  if (this.v1 === null) {
    v1res = (rhs.v1 === null);
  } else if (this.v1['gjstestEquals']) {
    v1res = this.v1.gjstestEquals(rhs.v1);
  } else {
    v1res = (this.v1 == rhs.v1);
  }
  if (!v1res)
    return false;
  var v2res = false
  if (this.v2 === null) {
    v2res = (rhs.v2 === null);
  } else if (this.v2['gjstestEquals']) {
    v2res = this.v2.gjstestEquals(rhs.v2);
  } else {
    v2res = (this.v2 == rhs.v2);
  }
  return v2res;
};
