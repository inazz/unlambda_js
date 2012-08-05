
function PageControlPanelTest() {
  this.app = new unlambda_app.MockApp();
  this.dom_helper = createMockInstance(util.DomHelper);
  this.panel = new page.ControlPanel(this.app, this.dom_helper);
  this.app.control_panel = this.panel;
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
  expectCall(this.app.controller.stop)();
  var ev = {};
  this.panel.onStopButtonClick(ev);
};
PageControlPanelTest.prototype.onPauseButtonClickCallController = function() {
  expectCall(this.app.controller.pause)();
  var ev = {};
  this.panel.onPauseButtonClick(ev);
};

PageControlPanelTest.prototype.onRunButtonClickCallController = function(e) {
  expectCall(this.app.controller.run)(unlambda_app.RUN_MODE.RUN, -1);
  var ev = {};
  this.panel.onRunButtonClick(ev);
};

PageControlPanelTest.prototype.onRunStepButtonClickCallController = function(e) {
  expectCall(this.app.controller.run)(unlambda_app.RUN_MODE.RUN_STEP, -1);
  var ev = {};
  this.panel.onRunStepButtonClick(ev);
};

PageControlPanelTest.prototype.onStepButtonClickCallControllerWithLimit = function(e) {
  this.app.app_context.getCurrentStep = createMockFunction();
  expectCall(this.app.app_context.getCurrentStep)().willOnce(returnWith(15));
  expectCall(this.app.controller.run)(unlambda_app.RUN_MODE.RUN, 16);
  var ev = {};
  this.panel.onStepButtonClick(ev);
};
