

var page = page || {};

// unlambda_app.App, util.DomHelper
page.ControlPanel = function(app, dom_helper) {
  this.app = app;
  this.dom_helper = dom_helper;
  this.buttons = {};
  this.last_clicked_name = '';
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
  this.last_clicked_name = 'stop';
  this.app.getController().stop();
};
page.ControlPanel.prototype.onPauseButtonClick = function(e) {
  this.last_clicked_name = 'pause';
  this.app.getController().pause();
};
page.ControlPanel.prototype.onRunButtonClick = function(e) {
  this.last_clicked_name = 'run';
  this.app.getController().setThreadWaitInterval(0);
  this.app.getController().run(unlambda_app.RUN_MODE.RUN, -1);
};
page.ControlPanel.prototype.onRunStepButtonClick = function(e) {
  this.last_clicked_name = 'run_step';
  this.app.getController().setThreadWaitInterval(1000);
  this.app.getController().run(unlambda_app.RUN_MODE.RUN_STEP, -1);
};
page.ControlPanel.prototype.onStepButtonClick = function(e) {
  this.last_clicked_name = 'step';
  this.app.getController().setThreadWaitInterval(0);
  this.app.getController().run(unlambda_app.RUN_MODE.RUN,
                               this.app.getAppContext().getCurrentStep() + 1);
};

page.ControlPanel.prototype.updateView = function() {
  var ctx = this.app.getAppContext();
  var disabledButtons = {};

  switch(ctx.run_state) {
  case unlambda_app.RUN_STATE.STOPPED:
    disabledButtons['stop'] = 1;
    disabledButtons['pause'] = 1;
    break;
  case unlambda_app.RUN_STATE.PAUSED:
    disabledButtons['pause'] = 1;
    break;
  case unlambda_app.RUN_STATE.RUNNING:
  case unlambda_app.RUN_STATE.INPUT_WAIT:
    disabledButtons[this.last_clicked_name] = 1;
    break;
  default:
    throw 'unexpected state.';
  }
  for (name in this.buttons) {
    this.dom_helper.enable(this.buttons[name], !(name in disabledButtons));
  }
};
