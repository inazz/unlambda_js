

var page = page || {};

// page.App, util.DomHelper
page.ControlPanel = function(app, domHelper) {
  this.app = app;
  this.domHelper = domHelper;
  this.runButton = null;
};

page.ControlPanel.prototype.init = function() {
  this.runButton = this.domHelper.get('run');
  this.domHelper.setEventListener(
    this.runButton, 'click', this, this.onRunButtonClick);
};

page.ControlPanel.prototype.onRunButtonClick = function(e) {
  // TODO.
};
