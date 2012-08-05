
var unlambda_app = unlambda_app || {};

// unlambda_app.Controller
// unlambda_app.AppContext
// function(unlambda_app.App): page.ControlPanel
unlambda_app.App = function(controller, app_context, panel_factory) {
  this.controller = controller
  this.app_context = app_context;
  this.control_panel = panel_factory['control'](this);
  this.code_panel = panel_factory['code'](this);
  this.input_panel = panel_factory['input'](this);
  this.output_panel = panel_factory['output'](this);
};

// Window, Document
unlambda_app.App.create = function(window, doc){
  var unl = new unlambda.Unlambda();
  var loop_thread_factory = new util.LoopThreadFactory(window);
  var controller = new unlambda_app.Controller(unl, loop_thread_factory);
  var dom_helper = new util.DomHelper(doc);
  var app_context = new unlambda_app.AppContext();
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
  return new unlambda_app.App(controller, app_context, panel_factory);
}

unlambda_app.App.prototype.init = function() {
  this.controller.init();
  this.control_panel.init();
  this.code_panel.init();
  this.input_panel.init();
  this.output_panel.init();
};

unlambda_app.App.prototype.getController = function() {
  return this.controller;
};

unlambda_app.App.prototype.getAppContext = function() {
  return this.app_context;
};

unlambda_app.App.prototype.getControlPanel = function() {
  return this.control_panel;
};

unlambda_app.App.prototype.getCodePanel = function() {
  return this.code_panel;
};

unlambda_app.App.prototype.getInputPanel = function() {
  return this.input_panel;
};

unlambda_app.App.prototype.getOutputPanel = function() {
  return this.output_panel;
};
