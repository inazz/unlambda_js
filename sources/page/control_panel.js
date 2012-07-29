

var page = page || {};

// page.App, util.DomHelper
page.ControlPanel = function(app, dom_helper) {
  this.app = app;
  this.dom_helper = dom_helper;
  this.run_button = null;
};

page.ControlPanel.prototype.init = function() {
  this.run_button = this.dom_helper.get('run');
  this.dom_helper.addEventListener(
    this.run_button, 'click', this, this.onRunButtonClick);
};

page.ControlPanel.prototype.onRunButtonClick = function(e) {
  // TODO.
};
