

var page = page || {};

// unlambda_app.App, util.DomHelper
page.ControlPanel = function(app, dom_helper) {
  this.app = app;
  this.dom_helper = dom_helper;
  this.buttons = {};
};

page.ControlPanel.prototype.init = function() {
  this.buttons['stop'] = this.dom_helper.get('stop');
  this.buttons['pause'] = this.dom_helper.get('pause');
  this.buttons['run'] = this.dom_helper.get('run');
  this.buttons['run_step'] = this.dom_helper.get('run_step');
  this.buttons['step'] = this.dom_helper.get('step');
  this.dom_helper.addEventListener(
    this.buttons['stop'], 'click', this, this.onStopButtonClick);
  this.dom_helper.addEventListener(
    this.buttons['pause'], 'click', this, this.onPauseButtonClick);
  this.dom_helper.addEventListener(
    this.buttons['run'], 'click', this, this.onRunButtonClick);
  this.dom_helper.addEventListener(
    this.buttons['run_step'], 'click', this, this.onRunStepButtonClick);
  this.dom_helper.addEventListener(
    this.buttons['step'], 'click', this, this.onStepButtonClick);
};

page.ControlPanel.prototype.onStopButtonClick = function(e) {
  this.app.getController().stop();
};
page.ControlPanel.prototype.onPauseButtonClick = function(e) {
  this.app.getController().pause();
};
page.ControlPanel.prototype.onRunButtonClick = function(e) {
  this.app.getController().run(unlambda_app.RUN_MODE.RUN, -1);
};
page.ControlPanel.prototype.onRunStepButtonClick = function(e) {
  this.app.getController().run(unlambda_app.RUN_MODE.RUN_STEP, -1);
};
page.ControlPanel.prototype.onStepButtonClick = function(e) {
  this.app.getController().run(unlambda_app.RUN_MODE.RUN,
                               this.app.getAppContext().getCurrentStep() + 1);
};
