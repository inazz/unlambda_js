

var unlambda = unlambda || {};

unlambda.Variable.prototype.gjstestEquals = function(rhs) {
  var memo = {};
  return this.gjstestEquals_(memo, rhs);
};
unlambda.Variable.prototype.gjstestEquals_ = function(memo, rhs) {
  if (this === rhs)
    return true;
  if (rhs === null || !(rhs instanceof Object) ||
      this.constructor != rhs.constructor)
    return false;
  if (!(this.id in memo)) {
    memo[this.id] = {};
  }
  if (rhs.id in memo[this.id]) {
    return true;
  } else {
    memo[this.id][rhs.id] = true;
  }
  if (this.op != rhs.op)
    return false;
  var v1res = false;
  if (this.v1 instanceof Object && this.constructor == this.v1.constructor) {
    v1res = this.v1.gjstestEquals_(memo, rhs.v1);
  } else {
    v1res = (this.v1 == rhs.v1);
  }
  if (!v1res)
    return false;
  var v2res = false
  if (this.v2 instanceof Object && this.constructor == this.v2.constructor) {
    v2res = this.v2.gjstestEquals_(memo, rhs.v2);
  } else {
    v2res = (this.v2 == rhs.v2);
  }
  return v2res;
};
