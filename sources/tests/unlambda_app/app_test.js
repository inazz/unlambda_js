
function UnlambdaAppTest() {
  this.controller = createMockInstance(unlambda_app.Controller);
  this.app_context = createMockInstance(unlambda_app.AppContext);
  this.control_panel = createMockInstance(page.ControlPanel);
  this.code_panel = createMockInstance(page.CodePanel);
  this.input_panel = createMockInstance(page.InputPanel);
  this.output_panel = createMockInstance(page.OutputPanel);

  var that = this;
  this.app = new unlambda_app.App(
    function(app) { return that.controller; },
    this.app_context,
    {'control': function(app) { return that.control_panel; },
     'code': function(app) { return that.code_panel; },
     'input': function(app) { return that.input_panel; },
     'output': function(app) { return that.output_panel; }});
}
registerTestSuite(UnlambdaAppTest);

UnlambdaAppTest.prototype.Acessors = function() {
  expectEq(this.controller, this.app.getController());
  expectEq(this.app_context, this.app.getAppContext());
  expectEq(this.control_panel, this.app.getControlPanel());
  expectEq(this.code_panel, this.app.getCodePanel());
  expectEq(this.input_panel, this.app.getInputPanel());
  expectEq(this.output_panel, this.app.getOutputPanel());
};

UnlambdaAppTest.prototype.CreateDoDIWithoutCallingAnyMethod = function() {
  var window = {}, document = {};
  unlambda_app.App.create(window, document);
};

UnlambdaAppTest.prototype.Init = function() {
  expectCall(this.controller.init)();
  expectCall(this.control_panel.init)();
  expectCall(this.code_panel.init)();
  expectCall(this.input_panel.init)();
  expectCall(this.output_panel.init)();

  this.app.init();
};
