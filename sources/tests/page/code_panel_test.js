
function PageCodePanelTest() {
  this.app = new unlambda_app.MockApp();
  this.dom_helper = createMockInstance(util.DomHelper);
  this.panel = new page.CodePanel(this.app, this.dom_helper);
  this.app.code_panel = this.panel;
  this.panel.code_area = {};
  this.panel.code_selector = {};
}
registerTestSuite(PageCodePanelTest);

PageCodePanelTest.prototype.initRegisterCallbacks = function() {
  var code_area = {}, code_selector = {};
  expectCall(this.dom_helper.get)('code').willOnce(returnWith(code_area));
  expectCall(this.dom_helper.get)('code_selector')
    .willOnce(returnWith(code_selector));
  expectCall(this.dom_helper.addEventListener)(
    code_area, 'keydown', this.panel, this.panel.onCodeChange);
  expectCall(this.dom_helper.addEventListener)(
    code_area, 'change', this.panel, this.panel.onCodeChange);
  expectCall(this.dom_helper.addEventListener)(
    code_selector, 'change', this.panel, this.panel.onSelectorChange);

  this.panel.init();
  expectEq(code_area, this.panel.code_area);
  expectEq(code_selector, this.panel.code_selector);
};

PageCodePanelTest.prototype.GetCode = function() {
  var code = "hoge";
  expectCall(this.dom_helper.getValue)(this.panel.code_area).willOnce(
    returnWith(code));
  expectEq(code, this.panel.getCode());
};

PageCodePanelTest.prototype.OnCodeChangeDoNothingWhenNotASample = function() {
  expectCall(this.dom_helper.getValue)(this.panel.code_selector)
    .willOnce(returnWith(""));
  this.panel.onCodeChange();
};

PageCodePanelTest.prototype.OnCodeChangeMakeSelectorDefaut = function() {
  expectCall(this.dom_helper.getValue)(this.panel.code_selector)
    .willOnce(returnWith("hello_world"));
  expectCall(this.dom_helper.setValue)(this.panel.code_selector, "");
  this.panel.onCodeChange();
};

PageCodePanelTest.prototype.OnSelectorChangeDoNothingWhenDefault = function() {
  expectCall(this.dom_helper.getValue)(this.panel.code_selector)
    .willOnce(returnWith(""));
  this.panel.onSelectorChange();
};

PageCodePanelTest.prototype.OnSelectorChangeHelloWorld = function() {
  expectCall(this.dom_helper.getValue)(this.panel.code_selector)
    .willOnce(returnWith("hello_world"));
  expectCall(this.dom_helper.setValue)(
    this.panel.code_area, page.CodePanel.HELLO_WORLD_CODE);
  this.panel.onSelectorChange();
};

PageCodePanelTest.prototype.OnSelectorChangeHelloWorldShort = function() {
  expectCall(this.dom_helper.getValue)(this.panel.code_selector)
    .willOnce(returnWith("hello_world_short"));
  expectCall(this.dom_helper.setValue)(
    this.panel.code_area, page.CodePanel.HELLO_WORLD_SHORT_CODE);
  this.panel.onSelectorChange();
};

PageCodePanelTest.prototype.UpdateViewEnableEditWhenStopped = function() {
  var ctx = this.app.getAppContext();

  ctx.run_state = unlambda_app.RUN_STATE.STOPPED;
  expectCall(this.dom_helper.enable)(this.panel.code_area, true);
  expectCall(this.dom_helper.enable)(this.panel.code_selector, true);
  this.panel.updateView();
};

PageCodePanelTest.prototype.UpdateViewDisableEditWhenNotStopped = function() {
  var ctx = this.app.getAppContext();

  ctx.run_state = unlambda_app.RUN_STATE.PAUSED;
  expectCall(this.dom_helper.enable)(this.panel.code_area, false);
  expectCall(this.dom_helper.enable)(this.panel.code_selector, false);
  this.panel.updateView();
};
