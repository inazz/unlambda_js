
function PageCodePanelTest() {
  this.app = new unlambda_app.MockApp();
  this.dom_helper = createMockInstance(util.DomHelper);
  this.panel = new page.CodePanel(this.app, this.dom_helper);
  this.app.code_panel = this.panel;
}
registerTestSuite(PageCodePanelTest);

PageCodePanelTest.prototype.initGrabCodeArea = function() {
  var code_area = {};
  expectCall(this.dom_helper.get)('code').willOnce(returnWith(code_area));

  this.panel.init();
  expectEq(code_area, this.panel.code_area);
};

PageCodePanelTest.prototype.GetCode = function() {
  this.panel.code_area = {};
  var code = "hoge";
  expectCall(this.dom_helper.getValue)(this.panel.code_area).willOnce(
    returnWith(code));
  expectEq(code, this.panel.getCode());
};

PageCodePanelTest.prototype.UpdateViewEnableEditWhenStopped = function() {
  var ctx = this.app.getAppContext();
  var code_area = {};
  this.panel.code_area = code_area;

  ctx.run_state = unlambda_app.RUN_STATE.STOPPED;
  expectCall(this.dom_helper.enable)(code_area, true);
  this.panel.updateView();
};

PageCodePanelTest.prototype.UpdateViewDisableEditWhenNotStopped = function() {
  var ctx = this.app.getAppContext();
  var code_area = {};
  this.panel.code_area = code_area;

  ctx.run_state = unlambda_app.RUN_STATE.PAUSED;
  expectCall(this.dom_helper.enable)(code_area, false);
  this.panel.updateView();
};
