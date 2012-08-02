
function LoopThreadTest() {
  this.window = {};
  this.window.setTimeout = createMockFunction();
  this.callback = createMockFunction();
  this.loop_thread = new util.LoopThread(this.window, this.callback);
}

registerTestSuite(LoopThreadTest);

LoopThreadTest.prototype.DefaultIsNotRunning = function() {
  expectFalse(this.loop_thread.isRunning());
};

LoopThreadTest.prototype.RunRegisterCalback = function() {
  var given_f;
  expectCall(this.window.setTimeout)(_, 0).willOnce(
    function(f, interval) {given_f = f;});
  this.loop_thread.run();
  expectTrue(this.loop_thread.isRunning());

  expectCall(this.callback)().times(1);
  given_f();
};

LoopThreadTest.prototype.SetInterval = function() {
  expectCall(this.window.setTimeout)(_, 10).times(1);
  this.loop_thread.setInterval(10);
  this.loop_thread.run();
  expectTrue(this.loop_thread.isRunning());
};

LoopThreadTest.prototype.KeepRunningIfCallbackReturnTrue = function() {
  var given_f;
  expectCall(this.window.setTimeout)(_, 0).times(2).willRepeatedly(
    function(f, interval) {given_f = f;});
  expectCall(this.callback)().willOnce(function(){return true;});

  this.loop_thread.run();
  expectTrue(this.loop_thread.isRunning());
  given_f();
  expectTrue(this.loop_thread.isRunning());
};

LoopThreadTest.prototype.StopIfCallbackReturnFalse = function() {
  var given_f;
  expectCall(this.window.setTimeout)(_, 0).willOnce(
    function(f, interval) {given_f = f;});
  expectCall(this.callback)().willOnce(function(){return false;});

  this.loop_thread.run();
  expectTrue(this.loop_thread.isRunning());
  given_f();
  expectFalse(this.loop_thread.isRunning());
};
