
var util = util || {};

util.LoopThread = function(window, f) {
  this.window = window;
  this.f = f;
  this.interval = util.LoopThread.defaultInterval;
  this.running = false;
  var that = this;
  this.main_callback = function () {that.run_();};
};

util.LoopThread.defaultInterval = 0;

util.LoopThread.prototype.setInterval = function(time_ms) {
  this.interval = time_ms;
};

util.LoopThread.prototype.isRunning = function() {
  return this.running;
};

util.LoopThread.prototype.run = function() {
  if (!this.isRunning()) {
    this.running = true;
    this.window.setTimeout(this.main_callback, this.interval);
  }
};

util.LoopThread.prototype.run_ = function() {
  var res = this.f();
  if (res) {
    this.window.setTimeout(this.main_callback, this.interval);
  } else {
    this.running = false;
  }
};