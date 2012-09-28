

var page = page || {};

// unlambda_app.App, util.DomHelper
page.CurrentCodePanel = function(app, dom_helper) {
  this.app = app;
  this.dom_helper = dom_helper;

  this.show_mode = false;
  // dom
  this.show_current_variable_checkbox = null;
  this.current_variable_container = null;
  this.current_variable_block = null;
};

page.CurrentCodePanel.prototype.init = function() {
  this.show_current_variable_checkbox =
    this.dom_helper.get('show_current_variable');
  this.current_variable_container =
    this.dom_helper.get('current_variable_container');
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
  this.dom_helper.setDisplay(this.current_variable_container,
                             (this.show_mode ? "": "none"));
  if (this.show_mode && ctx.runtime_context &&
      ctx.runtime_context.variable) {
    this.createDomDfs_(
      this.current_variable_block, null,
      ctx.runtime_context.variable,
      ctx.runtime_context.next_apply, false);
  }
};

page.CurrentCodePanel.prototype.createDomDfs_ = function(
  parent, text, variable, next_apply, is_apply_arg) {
  var is_apply = (variable.op == unlambda.OP.APPLY);
  if (is_apply || is_apply_arg) {
    var span = this.dom_helper.createElement('span');
    this.dom_helper.appendChild(parent, span);
    if (variable == next_apply) {
      this.dom_helper.addClass(span, 'next_apply');
    }
    parent = span;
    text = null;
  }
  if (text == null) {
    text = this.dom_helper.createTextNode();
    this.dom_helper.appendChild(parent, text);
  }
  if (variable.op == unlambda.OP.C1) {
    this.dom_helper.appendData(text, '<cont>');
    return;
  } else {
    if (variable.op == unlambda.OP.PRINT ||
        variable.op == unlambda.OP.COMPARE) {
      this.dom_helper.appendData(text, variable.op + variable.v1);
      return;
    } else {
      this.dom_helper.appendData(text, variable.op);
    }
  }
  if (variable.v1 != null) {
    this.createDomDfs_(parent, text, variable.v1, next_apply, is_apply);
  }
  if (variable.v2 != null) {
    this.createDomDfs_(parent, text, variable.v2, next_apply, is_apply);
  }
};
