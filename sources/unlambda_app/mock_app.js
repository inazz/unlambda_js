
var unlambda_app = unlambda_app || {};
unlambda_app.MockApp = function() {
  this.app_context = new unlambda_app.AppContext();
  this.controller = createMockInstance(unlambda_app.Controller);
  this.control_panel = createMockInstance(page.ControlPanel);
  this.code_panel = createMockInstance(page.CodePanel);
  this.input_panel = createMockInstance(page.InputPanel);
  this.output_panel = createMockInstance(page.OutputPanel);
  this.status_panel = createMockInstance(page.StatusPanel);
};

unlambda_app.MockApp.prototype.getController = function() {
  return this.controller;
};

unlambda_app.MockApp.prototype.getAppContext = function() {
  return this.app_context;
};

unlambda_app.MockApp.prototype.getControlPanel = function() {
  return this.control_panel;
};

unlambda_app.MockApp.prototype.getCodePanel = function() {
  return this.code_panel;
};

unlambda_app.MockApp.prototype.getInputPanel = function() {
  return this.input_panel;
};

unlambda_app.MockApp.prototype.getOutputPanel = function() {
  return this.output_panel;
};

unlambda_app.MockApp.prototype.getStatusPanel = function() {
  return this.status_panel;
};
