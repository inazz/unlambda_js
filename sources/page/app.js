
var page = page || {};

// util.DomHelper
// page.AppContext
// function(page.App, util.DomHelper): page.ControlPanel
page.App = function(dom_helper, app_context, panel_factory) {
  this.dom_helper = dom_helper;
  this.app_context = app_context;
  this.control_panel = panel_factory['control'](this, dom_helper);
  this.code_panel = panel_factory['code'](this, dom_helper);
  this.input_panel = panel_factory['input'](this, dom_helper);
  this.output_panel = panel_factory['output'](this, dom_helper);
};

// Document
page.App.create = function(doc){
  var dom_helper = new util.DomHelper(doc);
  var app_context = new page.AppContext();
  var panel_factory = {
    'control': function(app, dom_helper) {
      return new page.ControlPanel(app, dom_helper);},
    'code': function(app, dom_helper) {
      return new page.CodePanel(app, dom_helper);},
    'input': function(app, dom_helper) {
      return new page.InputPanel(app, dom_helper);},
    'output': function(app, dom_helper) {
      return new page.OutputPanel(app, dom_helper);},
  };
  return new page.App(dom_helper, app_context, panel_factory);
}

page.App.prototype.init = function() {
  this.control_panel.init();
  this.code_panel.init();
  this.input_panel.init();
  this.output_panel.init();
};

page.App.prototype.getAppContext = function() {
  return this.app_context;
};

page.App.prototype.getControlPanel = function() {
  return this.control_panel;
};

page.App.prototype.getCodePanel = function() {
  return this.code_panel;
};

page.App.prototype.getInputPanel = function() {
  return this.input_panel;
};

page.App.prototype.getOutputPanel = function() {
  return this.output_panel;
};
