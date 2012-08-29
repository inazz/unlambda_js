

var page = page || {};

// unlambda_app.App, util.DomHelper
page.CurrentCodePanel = function(app, dom_helper) {
  this.app = app;
  this.dom_helper = dom_helper;

  this.show_mode = false;
  // dom
  this.show_current_variable_checkbox = null;
  this.current_variable_block = null;
};

page.CurrentCodePanel.prototype.init = function() {
  this.show_current_variable_checkbox =
    this.dom_helper.get('show_current_variable');
  this.current_variable_block = this.dom_helper.get('current_variable_block');
  this.dom_helper.addEventListener(
    this.show_current_variable_checkbox, 'change', this, this.onCheckBoxChange);
  // initial value sestting.
  this.onCheckBoxChange({});
};

page.CurrentCodePanel.prototype.onCheckBoxChange = function(ev) {
  this.show_mode =
    this.dom_helper.isChecked(this.show_current_variable_checkbox);
  this.updateView();
};

page.CurrentCodePanel.prototype.updateView = function() {
  var ctx = this.app.getAppContext();
  this.dom_helper.removeChildren(this.current_variable_block);
  if (this.show_mode && ctx.runtime_context) {
    // TODO.
  }
};
