
function PageAppTest() {
  this.unlambda = {};
  this.dom_helper = {};
  this.app_context = {};
  this.control_panel = {};
  this.code_panel = {};
  this.input_panel = {};
  this.output_panel = {};
  var that = this;
  this.app = new page.App(
    this.unlambda, this.dom_helper, this.app_context,
    {'control': function(app, dom_helper) { return that.control_panel; },
     'code': function(app, dom_helper) { return that.code_panel; },
     'input': function(app, dom_helper) { return that.input_panel; },
     'output': function(app, dom_helper) { return that.output_panel; }});
}
registerTestSuite(PageAppTest);

PageAppTest.prototype.Acessors = function() {
  expectEq(this.unlambda, this.app.getUnlambda());
  expectEq(this.app_context, this.app.getAppContext());
  expectEq(this.control_panel, this.app.getControlPanel());
  expectEq(this.code_panel, this.app.getCodePanel());
  expectEq(this.input_panel, this.app.getInputPanel());
  expectEq(this.output_panel, this.app.getOutputPanel());
};

PageAppTest.prototype.Init = function() {
  this.control_panel.init = createMockFunction();
  this.code_panel.init = createMockFunction();
  this.input_panel.init = createMockFunction();
  this.output_panel.init = createMockFunction();

  expectCall(this.control_panel.init)().times(1);
  expectCall(this.code_panel.init)().times(1);
  expectCall(this.input_panel.init)().times(1);
  expectCall(this.output_panel.init)().times(1);

  this.app.init();
};
