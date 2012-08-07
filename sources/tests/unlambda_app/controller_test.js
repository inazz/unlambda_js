
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

UnlambdaAppControllerTest.prototype.Stop = function() {
  this.controller.updateView = createMockFunction();
  expectCall(this.controller.updateView)();

  this.controller.stop();
  var ctx = this.app.getAppContext();
  expectEq(unlambda_app.RUN_STATE.STOPPED, ctx.run_state);
  expectEq(null, ctx.runtime_context);
};

UnlambdaAppControllerTest.prototype.PauseKeepRuntimeContext = function() {
  this.controller.updateView = createMockFunction();
  expectCall(this.controller.updateView)();
  var ctx = this.app.getAppContext();
  ctx.run_state = unlambda_app.RUN_STATE.RUN;
  var original_runtime_context = {};
  ctx.runtime_context = original_runtime_context;

  this.controller.pause();
  expectEq(unlambda_app.RUN_STATE.PAUSED, ctx.run_state);
  expectEq(original_runtime_context, ctx.runtime_context);
};

UnlambdaAppControllerTest.prototype.RunResumeThreadWithParamIfNotStopped = function() {
  this.controller.run_thread = createMockInstance(util.LoopThread);
  this.controller.updateView = createMockFunction();
  expectCall(this.controller.run_thread.run)();
  expectCall(this.controller.updateView)();
  var ctx = this.app.getAppContext();
  ctx.run_state = unlambda_app.RUN_STATE.PAUSED;
  ctx.run_mode = unlambda_app.RUN_MODE.RUN;
  ctx.step_limit = 100;

  this.controller.run(unlambda_app.RUN_MODE.RUN_STEP, 111);
  expectEq(unlambda_app.RUN_STATE.RUNNING, ctx.run_state);
  expectEq(unlambda_app.RUN_MODE.RUN_STEP, ctx.run_mode);
  expectEq(111, ctx.step_limit);
};

UnlambdaAppControllerTest.prototype.RunShowCompileError = function() {
  var ctx = this.app.getAppContext();
  ctx.run_state = unlambda_app.RUN_STATE.STOPPED;
  var code = '`i`iix';
  var parse_result = createMockInstance(unlambda.parser.ParseResult);
  parse_result.success = false;
  parse_result.error = unlambda.parser.ERROR.EXTRA_CHARACTER;
  parse_result.error_pos = 5;
  expectCall(this.app.code_panel.getCode)().willOnce(returnWith(code));
  expectCall(this.unl.parse)(code).willOnce(returnWith(parse_result));
  expectCall(this.app.output_panel.setCompileError)(
    code, unlambda.parser.ERROR.EXTRA_CHARACTER, 5);
  this.controller.updateView = createMockFunction();
  expectCall(this.controller.updateView)();

  this.controller.run(unlambda_app.RUN_MODE.RUN, -1);
  expectEq(unlambda_app.RUN_STATE.STOPPED, ctx.run_state);
};

UnlambdaAppControllerTest.prototype.RunNewCode = function() {
  var ctx = this.app.getAppContext();
  ctx.run_state = unlambda_app.RUN_STATE.STOPPED;
  var code = 'i';
  var parse_result = createMockInstance(unlambda.parser.ParseResult);
  parse_result.success = true;
  parse_result.variable = createMockInstance(unlambda.Variable);
  var runtime_context = createMockInstance(unlambda.runtime.RuntimeContext);
  this.controller.run_thread = createMockInstance(util.LoopThread);
  this.controller.updateView = createMockFunction();

  expectCall(this.app.code_panel.getCode)().willOnce(returnWith(code));
  expectCall(this.unl.parse)(code).willOnce(returnWith(parse_result));
  expectCall(this.unl.newContext)(
    parse_result.variable, this.controller.input_callback,
    this.controller.output_callback)
    .willOnce(returnWith(runtime_context));
  expectCall(this.controller.run_thread.run)();
  expectCall(this.app.output_panel.clear)();
  expectCall(this.controller.updateView)();

  this.controller.run(unlambda_app.RUN_MODE.RUN_STEP, 100);
  expectEq(unlambda_app.RUN_STATE.RUNNING, ctx.run_state);
  expectEq(unlambda_app.RUN_MODE.RUN_STEP, ctx.run_mode);
  expectEq(100, ctx.step_limit);
  expectEq(runtime_context, ctx.runtime_context);
};
