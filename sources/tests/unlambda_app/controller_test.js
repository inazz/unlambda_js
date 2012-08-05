
function UnlambdaAppControllerTest() {
  this.app = new unlambda_app.MockApp();
  this.unl = createMockInstance(unlambda.Unlambda);
  this.loop_thread_factory = createMockInstance(util.LoopThreadFactory);
  this.controller =
    new unlambda_app.Controller(this.app, this.unl, this.loop_thread_factory);
  this.app.controller = this.controller;
}
registerTestSuite(UnlambdaAppControllerTest);

UnlambdaAppControllerTest.prototype.InitCreatesMembers = function() {
  var loop_func;
  expectCall(this.loop_thread_factory.create)(_).willOnce(
    function(f) { loop_func = f; });

  this.controller.init();

  this.controller.run_ = createMockFunction();
  expectCall(this.controller.run_)();
  loop_func();

  this.controller.onUnlambdaInput = createMockFunction();
  expectCall(this.controller.onUnlambdaInput)();
  this.controller.input_callback();

  var c = 'x';
  this.controller.onUnlambdaOutput = createMockFunction();
  expectCall(this.controller.onUnlambdaOutput)(c);
  this.controller.output_callback(c);

};

UnlambdaAppControllerTest.prototype.OnUnlambdaOutputRedirectToOutputPanel = function() {
  var c = 'x';
  expectCall(this.app.output_panel.appendOutput)(c);
  this.controller.onUnlambdaOutput(c);
};
