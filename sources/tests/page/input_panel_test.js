
function PageInputPanelTest() {
  this.app = new unlambda_app.MockApp();
  this.dom_helper = createMockInstance(util.DomHelper);
  this.panel = new page.InputPanel(this.app, this.dom_helper);
  this.app.input_panel = this.panel;
  // DOMS.
  this.panel.input_area = {};
  this.panel.input_eof = {};
  this.panel.input_wait = {};
}
registerTestSuite(PageInputPanelTest);

PageInputPanelTest.prototype.InitSetUpHandlers = function() {
  this.panel.onChange = createMockFunction();
  var input_area = {name:'a'}, input_eof = {}, input_wait = {};
  expectCall(this.dom_helper.get)('input').willOnce(returnWith(input_area));
  expectCall(this.dom_helper.get)('input_eof').willOnce(returnWith(input_eof));
  expectCall(this.dom_helper.get)('input_wait').willOnce(returnWith(input_wait));

  expectCall(this.dom_helper.addEventListener)(
    input_area, 'change', this.panel, this.panel.onChange);
  expectCall(this.dom_helper.addEventListener)(
    input_area, 'keyup', this.panel, this.panel.onChange);
  expectCall(this.dom_helper.addEventListener)(
    input_eof, 'change', this.panel, this.panel.onChange);
  expectCall(this.dom_helper.addEventListener)(
    input_wait, 'change', this.panel, this.panel.onChange);
  expectCall(this.panel.onChange)();

  this.panel.init();
};

PageInputPanelTest.prototype.OnChangeUpdateEofModeCaseTrue = function() {
  expectCall(this.panel.dom_helper.isChecked)(this.panel.input_eof)
    .willRepeatedly(returnWith(true));
  expectCall(this.panel.dom_helper.isChecked)(this.panel.input_wait)
    .willRepeatedly(returnWith(false));
  expectCall(this.app.controller.onInputChange)();
  this.panel.onChange();
  expectTrue(this.panel.eof_mode);
};

PageInputPanelTest.prototype.OnChangeUpdateEofModeCaseFalse = function() {
  expectCall(this.panel.dom_helper.isChecked)(this.panel.input_eof)
    .willRepeatedly(returnWith(false));
  expectCall(this.panel.dom_helper.isChecked)(this.panel.input_wait)
    .willRepeatedly(returnWith(true));
  expectCall(this.app.controller.onInputChange)();
  this.panel.onChange();
  expectFalse(this.panel.eof_mode);
};
