
var unlambda_app = unlambda_app || {};

// function(unlambda_app.App): unlambda_app.Controller
// unlambda_app.AppContext
// array of function(unlambda_app.App): page.*Panel
unlambda_app.App = function(controller_factory, app_context, panel_factory) {
  this.controller = controller_factory(this);
  this.app_context = app_context;
  this.control_panel = panel_factory['control'](this);
  this.input_code_panel = panel_factory['input_code'](this);
  this.input_panel = panel_factory['input'](this);
  this.output_panel = panel_factory['output'](this);
  this.status_panel = panel_factory['status'](this);
};

// Window, Document
unlambda_app.App.create = function(window, doc){
  var unl = new unlambda.Unlambda();
  var loop_thread_factory = new util.LoopThreadFactory(window);
  var controller_factory = function(app) {
    return new unlambda_app.Controller(app, unl, loop_thread_factory);
  };
  var dom_helper = new util.DomHelper(doc);
  var app_context = new unlambda_app.AppContext();
  var panel_factory = {
    'control': function(app) {
      return new page.ControlPanel(app, dom_helper);},
    'input_code': function(app) {
      return new page.InputCodePanel(app, dom_helper);},
    'input': function(app) {
      return new page.InputPanel(app, dom_helper);},
    'output': function(app) {
      return new page.OutputPanel(app, dom_helper);},
    'status': function(app) {
      return new page.StatusPanel(app, dom_helper);},
  };
  return new unlambda_app.App(controller_factory, app_context, panel_factory);
}

unlambda_app.App.prototype.init = function() {
  this.controller.init();
  this.control_panel.init();
  this.input_code_panel.init();
  this.input_panel.init();
  this.output_panel.init();
  this.status_panel.init();
  this.controller.updateView();
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

unlambda_app.App.prototype.getInputCodePanel = function() {
  return this.input_code_panel;
};

unlambda_app.App.prototype.getInputPanel = function() {
  return this.input_panel;
};

unlambda_app.App.prototype.getOutputPanel = function() {
  return this.output_panel;
};

unlambda_app.App.prototype.getStatusPanel = function() {
  return this.status_panel;
};
