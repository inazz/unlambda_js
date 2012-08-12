

var page = page || {};

// unlambda_app.App
// util.DomHelper
page.InputPanel = function(app, dom_helper) {
  this.app = app;
  this.dom_helper = dom_helper;
  // DOMs.
  this.input_area = null;
  this.input_eof = null;
  this.input_wait = null;
  // If input is empty, return EOF when eof_mode is true.
  // Otherwise, wait for input .
  this.eof_mode = false;
};

page.InputPanel.prototype.init = function() {
  this.input_area = this.dom_helper.get('input');
  this.input_eof = this.dom_helper.get('input_eof');
  this.input_wait = this.dom_helper.get('input_wait');
  this.dom_helper.addEventListener(
    this.input_area, 'change', this, this.onChange);
  this.dom_helper.addEventListener(
    this.input_area, 'keyup', this, this.onChange);
  this.dom_helper.addEventListener(
    this.input_eof, 'change', this, this.onChange);
  this.dom_helper.addEventListener(
    this.input_wait, 'change', this, this.onChange);
  // grab initial value.
  this.onChange();
};

page.InputPanel.prototype.onChange = function() {
  if (this.dom_helper.isChecked(this.input_eof)) {
    this.eof_mode = true;
  } else if (this.dom_helper.isChecked(this.input_wait)) {
    this.eof_mode = false;
  }
  this.app.getController().onInputChange();
};

