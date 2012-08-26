
function UnlambdaAppControllerTest() {
  this.app = new unlambda_app.MockApp();
  this.unl = createMockInstance(unlambda.Unlambda);
  this.loop_thread_factory = createMockInstance(util.LoopThreadFactory);
  this.controller =
    new unlambda_app.Controller(this.app, this.unl, this.loop_thread_factory);
  this.controller.run_thread = createMockInstance(util.LoopThread);
  this.app.controller = this.controller;
}
registerTestSuite(UnlambdaAppControllerTest);

UnlambdaAppControllerTest.expectUpdateView = function(test) {
  test.controller.updateView = createMockFunction();
  expectCall(test.controller.updateView)();
};

UnlambdaAppControllerTest.expectThreadRun = function(test) {
  expectCall(test.controller.run_thread.run)();
};

UnlambdaAppControllerTest.prototype.InitCreatesMembers = function() {
  var loop_func;
  expectCall(this.loop_thread_factory.create)(_).willOnce(
    function(f) { loop_func = f; });

  this.controller.init();

  this.controller.run_ = createMockFunction();
  expectCall(this.controller.run_)().willOnce(returnWith(true));
  expectTrue(loop_func());

  this.controller.onUnlambdaInput = createMockFunction();
  expectCall(this.controller.onUnlambdaInput)().willOnce(returnWith(true));
  expectTrue(this.controller.input_callback());

  var c = 'x';
  this.controller.onUnlambdaOutput = createMockFunction();
  expectCall(this.controller.onUnlambdaOutput)(c);
  this.controller.output_callback(c);
};

UnlambdaAppControllerTest.prototype.OnInputChangeRunThreadWhenWaitingInput = function() {
  var ctx = this.app.getAppContext();
  ctx.run_state = unlambda_app.RUN_STATE.INPUT_WAIT;

  UnlambdaAppControllerTest.expectThreadRun(this);
  this.controller.onInputChange();
  expectEq(unlambda_app.RUN_STATE.RUNNING, ctx.run_state);
};

UnlambdaAppControllerTest.prototype.OnInputChangeDoNothingWhenNotWaiting = function() {
  var ctx = this.app.getAppContext();
  ctx.run_state = unlambda_app.RUN_STATE.PAUSED;

  this.controller.onInputChange();
  expectEq(unlambda_app.RUN_STATE.PAUSED, ctx.run_state);
};

UnlambdaAppControllerTest.prototype.OnUnlambdaInputReadFromInputPanelAndEchoBack = function() {
  expectCall(this.app.getInputPanel().getEchoBackMode)()
    .willOnce(returnWith(true));
  expectCall(this.app.getInputPanel().consumeCharacter)()
    .willOnce(returnWith('x'));
  expectCall(this.app.getOutputPanel().appendInputEchoBack)('x')
  expectEq('x', this.controller.onUnlambdaInput());
};

UnlambdaAppControllerTest.prototype.OnUnlambdaInputNoEchobackIfDisabled = function() {
  expectCall(this.app.getInputPanel().getEchoBackMode)()
    .willOnce(returnWith(false));
  expectCall(this.app.getInputPanel().consumeCharacter)()
    .willOnce(returnWith('x'));
  expectEq('x', this.controller.onUnlambdaInput());
};

UnlambdaAppControllerTest.prototype.OnUnlambdaInputNoEchobackWhenEof = function() {
  expectCall(this.app.getInputPanel().getEchoBackMode)()
    .willOnce(returnWith(true));
  expectCall(this.app.getInputPanel().consumeCharacter)()
    .willOnce(returnWith(unlambda.runtime.IO_CODE.EOF));
  expectEq(unlambda.runtime.IO_CODE.EOF, this.controller.onUnlambdaInput());
};

UnlambdaAppControllerTest.prototype.OnUnlambdaInputNoEchobackWhenBlock = function() {
  expectCall(this.app.getInputPanel().getEchoBackMode)()
    .willOnce(returnWith(true));
  expectCall(this.app.getInputPanel().consumeCharacter)()
    .willOnce(returnWith(unlambda.runtime.IO_CODE.BLOCK));
  expectEq(unlambda.runtime.IO_CODE.BLOCK, this.controller.onUnlambdaInput());
};

UnlambdaAppControllerTest.prototype.OnUnlambdaOutputRedirectToOutputPanel = function() {
  var c = 'x';
  expectCall(this.app.output_panel.appendOutput)(c);
  this.controller.onUnlambdaOutput(c);
};

UnlambdaAppControllerTest.prototype.Stop = function() {
  UnlambdaAppControllerTest.expectUpdateView(this);
  this.controller.stop();
  var ctx = this.app.getAppContext();
  expectEq(unlambda_app.RUN_STATE.STOPPED, ctx.run_state);
};

UnlambdaAppControllerTest.prototype.PauseKeepRuntimeContext = function() {
  var ctx = this.app.getAppContext();
  ctx.run_state = unlambda_app.RUN_STATE.RUN;
  var original_runtime_context = {};
  ctx.runtime_context = original_runtime_context;
  UnlambdaAppControllerTest.expectUpdateView(this);

  this.controller.pause();
  expectEq(unlambda_app.RUN_STATE.PAUSED, ctx.run_state);
  expectEq(original_runtime_context, ctx.runtime_context);
};

UnlambdaAppControllerTest.prototype.RunResumeThreadWithParamIfNotStopped = function() {
  UnlambdaAppControllerTest.expectThreadRun(this);
  var ctx = this.app.getAppContext();
  ctx.run_state = unlambda_app.RUN_STATE.PAUSED;
  ctx.run_mode = unlambda_app.RUN_MODE.RUN;
  ctx.step_limit = 100;
  UnlambdaAppControllerTest.expectUpdateView(this);

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
  expectCall(this.app.input_code_panel.getCode)().willOnce(returnWith(code));
  expectCall(this.unl.parse)(code).willOnce(returnWith(parse_result));
  expectCall(this.app.output_panel.clear)();
  expectCall(this.app.status_panel.clear)();
  expectCall(this.app.status_panel.setCompileError)(
    code, unlambda.parser.ERROR.EXTRA_CHARACTER, 5);
  UnlambdaAppControllerTest.expectUpdateView(this);

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

  expectCall(this.app.input_code_panel.getCode)().willOnce(returnWith(code));
  expectCall(this.unl.parse)(code).willOnce(returnWith(parse_result));
  expectCall(this.unl.newContext)(
    parse_result.variable, this.controller.input_callback,
    this.controller.output_callback)
    .willOnce(returnWith(runtime_context));
  expectCall(this.app.output_panel.clear)();
  expectCall(this.app.status_panel.clear)();
  UnlambdaAppControllerTest.expectThreadRun(this);
  UnlambdaAppControllerTest.expectUpdateView(this);

  this.controller.run(unlambda_app.RUN_MODE.RUN_STEP, 100);
  expectEq(unlambda_app.RUN_STATE.RUNNING, ctx.run_state);
  expectEq(unlambda_app.RUN_MODE.RUN_STEP, ctx.run_mode);
  expectEq(100, ctx.step_limit);
  expectEq(runtime_context, ctx.runtime_context);
};

UnlambdaAppControllerTest.prototype.SetThreadWaitInterval = function() {
  expectCall(this.controller.run_thread.setInterval)(1000);
  this.controller.setThreadWaitInterval(1000);
};

UnlambdaAppControllerTest.prototype.SetUpRuntimeStep = function() {
  var ctx = this.app.getAppContext();
  var max_step = unlambda_app.Controller.MAX_BURST_STEP;
  ctx.runtime_context = createMockInstance(unlambda.runtime.RuntimeContext);
  ctx.runtime_context.step = 100;

  ctx.run_state = unlambda_app.RUN_MODE.RUNNING;
  ctx.run_mode = unlambda_app.RUN_MODE.RUN;
  ctx.step_limit = 100;
  this.controller.setUpRuntimeStepLimit(ctx);
  expectEq(100, ctx.runtime_context.step_limit);

  ctx.step_limit = 100 + max_step - 1;
  this.controller.setUpRuntimeStepLimit(ctx);
  expectEq(100 + max_step - 1, ctx.runtime_context.step_limit);

  ctx.step_limit = 100 + max_step + 1;
  this.controller.setUpRuntimeStepLimit(ctx);
  expectEq(100 + max_step, ctx.runtime_context.step_limit);

  ctx.step_limit = -1;
  this.controller.setUpRuntimeStepLimit(ctx);
  expectEq(100 + max_step, ctx.runtime_context.step_limit);

  ctx.run_mode = unlambda_app.RUN_MODE.RUN_STEP;
  ctx.step_limit = 100;
  this.controller.setUpRuntimeStepLimit(ctx);
  expectEq(100, ctx.runtime_context.step_limit);

  ctx.step_limit = 102;
  this.controller.setUpRuntimeStepLimit(ctx);
  expectEq(101, ctx.runtime_context.step_limit);

  ctx.step_limit = -1;
  this.controller.setUpRuntimeStepLimit(ctx);
  expectEq(101, ctx.runtime_context.step_limit);
};

UnlambdaAppControllerTest.prototype.Run_StopsIfNotRunning = function() {
  var ctx = this.app.getAppContext();
  ctx.step_limit = -1;
  ctx.runtime_context = createMockInstance(unlambda.runtime.RuntimeContext);

  ctx.run_state = unlambda_app.RUN_STATE.STOPPED;
  expectFalse(this.controller.run_());

  ctx.run_state = unlambda_app.RUN_STATE.PAUSED;
  expectFalse(this.controller.run_());

  ctx.run_state = unlambda_app.RUN_STATE.INPUT_WAIT;
  expectFalse(this.controller.run_());
};

UnlambdaAppControllerTest.prototype.Run_StopsIfExited= function() {
  var ctx = this.app.getAppContext();
  ctx.step_limit = 1;
  ctx.run_state = unlambda_app.RUN_STATE.RUNNING;
  ctx.run_mode = unlambda_app.RUN_MODE.RUN;
  ctx.runtime_context = createMockInstance(unlambda.runtime.RuntimeContext);
  ctx.runtime_context.step = 0;
  ctx.runtime_context.step_limit = 1;
  UnlambdaAppControllerTest.expectUpdateView(this);

  expectCall(this.unl.run)(ctx.runtime_context).willOnce(function (ctx) {
    ctx.state = unlambda.runtime.STATE.EXITED;});
  expectFalse(this.controller.run_());
  expectEq(unlambda_app.RUN_STATE.STOPPED, ctx.run_state);
};

UnlambdaAppControllerTest.prototype.Run_WaitInputIfInputBlocks = function() {
  var ctx = this.app.getAppContext();
  ctx.step_limit = 1;
  ctx.run_state = unlambda_app.RUN_STATE.RUNNING;
  ctx.run_mode = unlambda_app.RUN_MODE.RUN;
  ctx.runtime_context = createMockInstance(unlambda.runtime.RuntimeContext);
  ctx.runtime_context.step = 0;
  ctx.runtime_context.step_limit = 1;
  UnlambdaAppControllerTest.expectUpdateView(this);

  expectCall(this.unl.run)(ctx.runtime_context).willOnce(function (ctx) {
    ctx.state = unlambda.runtime.STATE.INPUT_WAIT;});
  expectFalse(this.controller.run_());
  expectEq(unlambda_app.RUN_STATE.INPUT_WAIT, ctx.run_state);
};

UnlambdaAppControllerTest.prototype.Run_PausesIfStepLimit = function() {
  var ctx = this.app.getAppContext();
  ctx.step_limit = 1;
  ctx.run_state = unlambda_app.RUN_STATE.RUNNING;
  ctx.run_mode = unlambda_app.RUN_MODE.RUN;
  ctx.runtime_context = createMockInstance(unlambda.runtime.RuntimeContext);
  ctx.runtime_context.step = 0;
  ctx.runtime_context.step_limit = 1;
  UnlambdaAppControllerTest.expectUpdateView(this);

  expectCall(this.unl.run)(ctx.runtime_context).willOnce(function (ctx) {
    ctx.state = unlambda.runtime.STATE.STEP_LIMIT;
    ctx.step = 1;});
  expectFalse(this.controller.run_());
  expectEq(unlambda_app.RUN_STATE.PAUSED, ctx.run_state);
};


UnlambdaAppControllerTest.prototype.Run_KeepRunStepIfStilRemainingStep = function() {
  var ctx = this.app.getAppContext();
  ctx.step_limit = 2;
  ctx.run_state = unlambda_app.RUN_STATE.RUNNING;
  ctx.run_mode = unlambda_app.RUN_MODE.RUN_STEP;
  ctx.runtime_context = createMockInstance(unlambda.runtime.RuntimeContext);
  ctx.runtime_context.step = 0;
  ctx.runtime_context.step_limit = 1;
  UnlambdaAppControllerTest.expectUpdateView(this);

  expectCall(this.unl.run)(ctx.runtime_context).willOnce(function (ctx) {
    ctx.state = unlambda.runtime.STATE.STEP_LIMIT;
    ctx.step = 1;});
  expectTrue(this.controller.run_());
  expectEq(unlambda_app.RUN_STATE.RUNNING, ctx.run_state);
};

UnlambdaAppControllerTest.prototype.Run_KeepRunWithoutUpdateViewIfMaxStepBreak = function() {
  var ctx = this.app.getAppContext();
  ctx.step_limit = -1;
  ctx.run_state = unlambda_app.RUN_STATE.RUNNING;
  ctx.run_mode = unlambda_app.RUN_MODE.RUN;
  ctx.runtime_context = createMockInstance(unlambda.runtime.RuntimeContext);
  ctx.runtime_context.step = 0;
  ctx.runtime_context.step_limit = unlambda_app.Controller.MAX_BURST_STEP;;

  expectCall(this.unl.run)(ctx.runtime_context).willOnce(function (ctx) {
    ctx.state = unlambda.runtime.STATE.STEP_LIMIT;
    ctx.step = unlambda_app.Controller.MAX_BURST_STEP;;});
  expectTrue(this.controller.run_());
  expectEq(unlambda_app.RUN_STATE.RUNNING, ctx.run_state);
};

UnlambdaAppControllerTest.prototype.UpdateView = function() {
  expectCall(this.app.getControlPanel().updateView)();
  expectCall(this.app.getInputCodePanel().updateView)();
  expectCall(this.app.getStatusPanel().updateView)();

  this.controller.updateView();
};
