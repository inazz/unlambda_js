
function PageCurrentCodePanelTest() {
  this.app = new unlambda_app.MockApp();
  this.dom_helper = createMockInstance(util.DomHelper);
  this.panel = new page.CurrentCodePanel(this.app, this.dom_helper);
  this.app.current_code_panel = this.panel;

  this.panel.show_current_variable_checkbox = {};
  this.panel.current_variable_block = {};
}
registerTestSuite(PageCurrentCodePanelTest);

PageCurrentCodePanelTest.prototype.initSetUpHandler = function() {
  var checkbox = {}, divBlock = {};
  this.panel.onCheckBoxChange = createMockFunction();
  expectCall(this.dom_helper.get)('show_current_variable').willOnce(
    returnWith(checkbox));
  expectCall(this.dom_helper.get)('current_variable_block').willOnce(
    returnWith(divBlock));
  
  expectCall(this.dom_helper.addEventListener)(
    checkbox, 'change', this.panel, this.panel.onCheckBoxChange);
  expectCall(this.panel.onCheckBoxChange)(_);

  this.panel.init();
  expectEq(checkbox, this.panel.show_current_variable_checkbox);
  expectEq(divBlock, this.panel.current_variable_block);
};

PageCurrentCodePanelTest.prototype.onCheckBoxChangeUpdateView = function() {
  var panel = this.panel;
  panel.show_mode = false;
  this.panel.updateView = createMockFunction();
  expectCall(this.dom_helper.isChecked)(
    this.panel.show_current_variable_checkbox).willOnce(returnWith(true));
  expectCall(this.panel.updateView)()

  var ev = {};
  this.panel.onCheckBoxChange(ev);
  expectTrue(panel.show_mode);
};
