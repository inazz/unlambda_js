
function UnlambdaAppTest() {
  this.controller = createMockInstance(unlambda_app.Controller);
  this.app_context = createMockInstance(unlambda_app.AppContext);
  this.control_panel = createMockInstance(page.ControlPanel);
  this.current_code_panel = createMockInstance(page.CurrentCodePanel);
  this.input_code_panel = createMockInstance(page.InputCodePanel);
  this.input_panel = createMockInstance(page.InputPanel);
  this.output_panel = createMockInstance(page.OutputPanel);
  this.status_panel = createMockInstance(page.StatusPanel);

  var that = this;
  this.app = new unlambda_app.App(
    function(app) { return that.controller; },
    this.app_context,
    {'control': function(app) { return that.control_panel; },
     'current_code': function(app) { return that.current_code_panel; },
     'input_code': function(app) { return that.input_code_panel; },
     'input': function(app) { return that.input_panel; },
     'output': function(app) { return that.output_panel; },
     'status': function(app) { return that.status_panel; }});
}
registerTestSuite(UnlambdaAppTest);

UnlambdaAppTest.prototype.Acessors = function() {
  expectEq(this.controller, this.app.getController());
  expectEq(this.app_context, this.app.getAppContext());
  expectEq(this.control_panel, this.app.getControlPanel());
  expectEq(this.current_code_panel, this.app.getCurrentCodePanel());
  expectEq(this.input_code_panel, this.app.getInputCodePanel());
  expectEq(this.input_panel, this.app.getInputPanel());
  expectEq(this.output_panel, this.app.getOutputPanel());
  expectEq(this.status_panel, this.app.getStatusPanel());
};

UnlambdaAppTest.prototype.CreateDoDIWithoutCallingAnyMethod = function() {
  var window = {}, document = {};
  unlambda_app.App.create(window, document);
};

UnlambdaAppTest.prototype.Init = function() {
  expectCall(this.controller.init)();
  expectCall(this.control_panel.init)();
  expectCall(this.current_code_panel.init)();
  expectCall(this.input_code_panel.init)();
  expectCall(this.input_panel.init)();
  expectCall(this.output_panel.init)();
  expectCall(this.status_panel.init)();
  expectCall(this.controller.updateView)();

  this.app.init();
};
