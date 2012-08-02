
function LoopThreadFactoryTest() {
  this.window = {};
  this.window.setTimeout = createMockFunction();
  this.loop_thread_factory = new util.LoopThreadFactory(this.window);
}

registerTestSuite(LoopThreadFactoryTest);

LoopThreadFactoryTest.prototype.Integration = function() {
  var given_f;
  expectCall(this.window.setTimeout)(_, 0).willOnce(
    function(f, interval) {given_f = f;});
  var callback = createMockFunction();
  expectCall(callback)().willOnce(returnWith(false));

  var loop_thread = this.loop_thread_factory.create(callback);

  loop_thread.run();
  given_f();
  
};
