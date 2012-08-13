
function PageInputPanelTest() {
  this.app = new unlambda_app.MockApp();
  this.dom_helper = createMockInstance(util.DomHelper);
  this.panel = new page.InputPanel(this.app, this.dom_helper);
  this.app.input_panel = this.panel;
  // DOMS.
  this.panel.input_area = {};
  this.panel.input_eof_checkbox = {};
  this.panel.input_wait_checkbox = {};
  this.panel.echo_back_checkbox = {};
}
registerTestSuite(PageInputPanelTest);

PageInputPanelTest.prototype.InitSetUpHandlers = function() {
  this.panel.onChange = createMockFunction();
  var input_area = {}, input_eof_checkbox = {}, input_wait_checkbox = {},
      echo_back_checkbox = {};
  expectCall(this.dom_helper.get)('input').willOnce(returnWith(input_area));
  expectCall(this.dom_helper.get)('input_eof').willOnce(
    returnWith(input_eof_checkbox));
  expectCall(this.dom_helper.get)('input_wait').willOnce(
    returnWith(input_wait_checkbox));
  expectCall(this.dom_helper.get)('echo_back').willOnce(
    returnWith(echo_back_checkbox));

  expectCall(this.dom_helper.addEventListener)(
    input_area, 'change', this.panel, this.panel.onChange);
  expectCall(this.dom_helper.addEventListener)(
    input_area, 'keyup', this.panel, this.panel.onChange);
  expectCall(this.dom_helper.addEventListener)(
    input_eof_checkbox, 'change', this.panel, this.panel.onChange);
  expectCall(this.dom_helper.addEventListener)(
    input_wait_checkbox, 'change', this.panel, this.panel.onChange);

  expectCall(this.panel.onChange)();

  this.panel.init();
};

PageInputPanelTest.prototype.OnChangeUpdateEofModeCaseTrue = function() {
  expectCall(this.panel.dom_helper.isChecked)(this.panel.input_eof_checkbox)
    .willRepeatedly(returnWith(true));
  expectCall(this.panel.dom_helper.isChecked)(this.panel.input_wait_checkbox)
    .willRepeatedly(returnWith(false));
  expectCall(this.app.controller.onInputChange)();
  this.panel.onChange();
  expectTrue(this.panel.eof_mode);
};

PageInputPanelTest.prototype.OnChangeUpdateEofModeCaseFalse = function() {
  expectCall(this.panel.dom_helper.isChecked)(this.panel.input_eof_checkbox)
    .willRepeatedly(returnWith(false));
  expectCall(this.panel.dom_helper.isChecked)(this.panel.input_wait_checkbox)
    .willRepeatedly(returnWith(true));
  expectCall(this.app.controller.onInputChange)();
  this.panel.onChange();
  expectFalse(this.panel.eof_mode);
};

PageInputPanelTest.prototype.ComsumeCharacter = function() {
  expectCall(this.dom_helper.getValue)(this.panel.input_area).willOnce(
    returnWith("abc"));
  expectCall(this.dom_helper.setValue)(this.panel.input_area, "bc");

  expectEq('a', this.panel.consumeCharacter());
};

PageInputPanelTest.prototype.ComsumeCharacterReturnEOFWhenEmptyAndEofMode = function() {
  expectCall(this.dom_helper.getValue)(this.panel.input_area).willOnce(
    returnWith(""));
  this.panel.eof_mode = true;

  expectEq(unlambda.runtime.IO_CODE.EOF, this.panel.consumeCharacter());
};

PageInputPanelTest.prototype.ComsumeCharacterBlocksWhenEmptyAndNotEofMode = function() {
  expectCall(this.dom_helper.getValue)(this.panel.input_area).willOnce(
    returnWith(""));
  this.panel.eof_mode = false;

  expectEq(unlambda.runtime.IO_CODE.BLOCK, this.panel.consumeCharacter());
};

PageInputPanelTest.prototype.GetEchoBackMode = function() {
  expectCall(this.dom_helper.isChecked)(this.panel.echo_back_checkbox)
    .willOnce(returnWith(false));
  expectFalse(this.panel.getEchoBackMode());

  expectCall(this.dom_helper.isChecked)(this.panel.echo_back_checkbox)
    .willOnce(returnWith(true));
  expectTrue(this.panel.getEchoBackMode());
};
