
function PageControlPanelTest() {
  this.app = new unlambda_app.MockApp();
  this.dom_helper = createMockInstance(util.DomHelper);
  this.panel = new page.ControlPanel(this.app, this.dom_helper);
  this.app.control_panel = this.panel;
  this.panel.buttons = {
    'stop': {}, 'pause': {}, 'run': {}, 'run_step': {}, 'step': {}};
}
registerTestSuite(PageControlPanelTest);

PageControlPanelTest.prototype.initSetUpStopButtonHandler = function() {
  var stopButton = {}, pauseButton = {}, runButton = {},
      runStepButton = {}, stepButton = {};
  expectCall(this.dom_helper.get)('stop').willOnce(returnWith(stopButton));
  expectCall(this.dom_helper.get)('pause').willOnce(returnWith(pauseButton));
  expectCall(this.dom_helper.get)('run').willOnce(returnWith(runButton));
  expectCall(this.dom_helper.get)('run_step').willOnce(returnWith(runStepButton));
  expectCall(this.dom_helper.get)('step').willOnce(returnWith(stepButton));
  
  expectCall(this.dom_helper.addEventListener)(
    stopButton, 'click', this.panel, this.panel.onStopButtonClick);
  expectCall(this.dom_helper.addEventListener)(
    pauseButton, 'click', this.panel, this.panel.onPauseButtonClick);
  expectCall(this.dom_helper.addEventListener)(
    runButton, 'click', this.panel, this.panel.onRunButtonClick);
  expectCall(this.dom_helper.addEventListener)(
    runStepButton, 'click', this.panel, this.panel.onRunStepButtonClick);
  expectCall(this.dom_helper.addEventListener)(
    stepButton, 'click', this.panel, this.panel.onStepButtonClick);

  this.panel.init();
};

PageControlPanelTest.prototype.onStopButtonClickCallController = function() {
  var panel = this.panel;
  // make sure the last_licked_name property changed before calling controller.
  // becuase controller may call updateView.
  expectCall(this.app.controller.stop)().willOnce(
    function() {expectEq('stop', panel.last_clicked_name);});
  var ev = {};
  this.panel.onStopButtonClick(ev);
};
PageControlPanelTest.prototype.onPauseButtonClickCallController = function() {
  var panel = this.panel;
  expectCall(this.app.controller.pause)().willOnce(
    function() {expectEq('pause', panel.last_clicked_name);});
  var ev = {};
  this.panel.onPauseButtonClick(ev);
};

PageControlPanelTest.prototype.onRunButtonClickCallController = function(e) {
  var panel = this.panel;
  expectCall(this.app.controller.run)(unlambda_app.RUN_MODE.RUN, -1).willOnce(
    function() {expectEq('run', panel.last_clicked_name);});
  var ev = {};
  this.panel.onRunButtonClick(ev);
};

PageControlPanelTest.prototype.onRunStepButtonClickCallController = function(e) {
  var panel = this.panel;
  expectCall(this.app.controller.run)(unlambda_app.RUN_MODE.RUN_STEP, -1)
    .willOnce(function() {expectEq('run_step', panel.last_clicked_name);});
  var ev = {};
  this.panel.onRunStepButtonClick(ev);
};

PageControlPanelTest.prototype.onStepButtonClickCallControllerWithLimit = function(e) {
  var panel = this.panel;
  this.app.app_context.getCurrentStep = createMockFunction();
  expectCall(this.app.app_context.getCurrentStep)().willOnce(returnWith(15));
  expectCall(this.app.controller.run)(unlambda_app.RUN_MODE.RUN, 16)
    .willOnce(function() {expectEq('step', panel.last_clicked_name);});
  var ev = {};
  this.panel.onStepButtonClick(ev);
};

PageControlPanelTest.prototype.updateViewWhenStopped = function(e) {
  this.app.app_context.run_state = unlambda_app.RUN_STATE.STOPPED;

  expectCall(this.dom_helper.enable)(this.panel.buttons['stop'], false);
  expectCall(this.dom_helper.enable)(this.panel.buttons['pause'], false);
  expectCall(this.dom_helper.enable)(this.panel.buttons['run'], true);
  expectCall(this.dom_helper.enable)(this.panel.buttons['run_step'], true);
  expectCall(this.dom_helper.enable)(this.panel.buttons['step'], true);
  this.panel.updateView();
};

PageControlPanelTest.prototype.updateViewWhenPaused = function(e) {
  this.app.app_context.run_state = unlambda_app.RUN_STATE.PAUSED;

  expectCall(this.dom_helper.enable)(this.panel.buttons['stop'], true);
  expectCall(this.dom_helper.enable)(this.panel.buttons['pause'], false);
  expectCall(this.dom_helper.enable)(this.panel.buttons['run'], true);
  expectCall(this.dom_helper.enable)(this.panel.buttons['run_step'], true);
  expectCall(this.dom_helper.enable)(this.panel.buttons['step'], true);
  this.panel.updateView();
};

PageControlPanelTest.prototype.updateViewDisablePreviouslyClickedButtonWhenRun = function(e) {
  this.app.app_context.run_state = unlambda_app.RUN_STATE.RUNNING
  this.panel.last_clicked_name = 'run_step';
  expectCall(this.dom_helper.enable)(this.panel.buttons['stop'], true);
  expectCall(this.dom_helper.enable)(this.panel.buttons['pause'], true);
  expectCall(this.dom_helper.enable)(this.panel.buttons['run'], true);
  expectCall(this.dom_helper.enable)(this.panel.buttons['run_step'], false);
  expectCall(this.dom_helper.enable)(this.panel.buttons['step'], true);
  this.panel.updateView();
};
