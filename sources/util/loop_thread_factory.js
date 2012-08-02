
var util = util || {};

util.LoopThreadFactory = function(window) {
  this.window = window;
};

util.LoopThreadFactory.prototype.create = function(f) {
  return new util.LoopThread(this.window, f);
};
