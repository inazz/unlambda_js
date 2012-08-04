
var page = page || {};

// unlambda.Unlambda
// page.AppContext
// function(page.App): page.ControlPanel
page.App = function(unlambda, app_context, panel_factory) {
  this.unlambda = unlambda;
  this.app_context = app_context;
  this.control_panel = panel_factory['control'](this);
  this.code_panel = panel_factory['code'](this);
  this.input_panel = panel_factory['input'](this);
  this.output_panel = panel_factory['output'](this);
};

// Window, Document
page.App.create = function(doc){
  var unl = new unlambda.Unlambda();
  var dom_helper = new util.DomHelper(doc);
  var app_context = new page.AppContext();
  var panel_factory = {
    'control': function(app) {
      return new page.ControlPanel(app, dom_helper);},
    'code': function(app) {
      return new page.CodePanel(app, dom_helper);},
    'input': function(app) {
      return new page.InputPanel(app, dom_helper);},
    'output': function(app) {
      return new page.OutputPanel(app, dom_helper);},
  };
  return new page.App(unl, app_context, panel_factory);
}

page.App.prototype.init = function() {
  this.control_panel.init();
  this.code_panel.init();
  this.input_panel.init();
  this.output_panel.init();
};

page.App.prototype.getUnlambda = function() {
  return this.unlambda;
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
