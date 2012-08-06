
function PageOutputPanelTest() {
  this.app = new unlambda_app.MockApp();
  this.dom_helper = createMockInstance(util.DomHelper);
  this.panel = new page.OutputPanel(this.app, this.dom_helper);
  this.panel.output_block = {}; // output div block.
  this.app.output_panel = this.panel;
}
registerTestSuite(PageOutputPanelTest);

PageOutputPanelTest.prototype.InitGrabsDom = function() {
  var outputDom = {};
  expectCall(this.dom_helper.get)('output_block')
    .willOnce(returnWith(outputDom));

  this.panel.init();
  expectEq(outputDom, this.panel.output_block);
};

PageOutputPanelTest.prototype.ClearRemovesAll = function() {
  expectCall(this.dom_helper.removeChildren)(this.panel.output_block);

  this.panel.clear();
};

PageOutputPanelTest.prototype.AppendOutputCreatesSpanOnce = function() {
  var span = {}, text_node = {};

  expectCall(this.dom_helper.createElement)('span').willOnce(returnWith(span));
  expectCall(this.dom_helper.createTextNode)().willOnce(returnWith(text_node));
  expectCall(this.dom_helper.appendChild)(this.panel.output_block, span);
  expectCall(this.dom_helper.appendChild)(span, text_node);
  expectCall(this.dom_helper.appendData)(text_node, 'hoge');
  this.panel.appendOutput('hoge');

  expectCall(this.dom_helper.appendData)(text_node, 'fuga');
  this.panel.appendOutput('fuga');
};

// PageOutputPanelTest, string?, string, string?
PageOutputPanelTest.setUpCompileErrorWithCodeSnippetExpectation = function(
  test, before_error_code, error_code, after_error_code) {
  expectCall(test.dom_helper.removeChildren)(test.panel.output_block);

  var span = {name: 'span'}, span_text = {name: 'span_text'};
  var code = {name: 'code'}, code_span = {name: 'code_span'};
  var before_text = {name: 'before_text'}, code_text = {name: 'code_text'},
    after_text = {name: 'after_text'};
  expectCall(test.dom_helper.createElement)('span')
    .willOnce(returnWith(span))
    .willOnce(returnWith(code_span));
  expectCall(test.dom_helper.createElement)('code')
    .willOnce(returnWith(code))
  var expectation = expectCall(test.dom_helper.createTextNode)();
  expectation = expectation.willOnce(returnWith(span_text));
  if (before_error_code != null)
    expectation = expectation.willOnce(returnWith(before_text));
  expectation = expectation.willOnce(returnWith(code_text));
  if (after_error_code != null)
    expectation = expectation.willOnce(returnWith(after_text));

  // <span class="error_message">xxx</span>
  expectCall(test.dom_helper.appendChild)(test.panel.output_block, span);
  expectCall(test.dom_helper.addClass)(span, 'error_message');
  expectCall(test.dom_helper.appendChild)(span, span_text);
  expectCall(test.dom_helper.appendData)(span_text, _);

  // <code class="error_snippet">
  //   BEFORE<span class="error_code">CODE</span>AFTER
  // </code>
  expectCall(test.dom_helper.appendChild)(test.panel.output_block, code);
  expectCall(test.dom_helper.addClass)(code, 'error_snippet');
  if (before_error_code != null) {
    expectCall(test.dom_helper.appendChild)(code, before_text);
    expectCall(test.dom_helper.appendData)(before_text, before_error_code);
  }
  expectCall(test.dom_helper.appendChild)(code, code_span);
  expectCall(test.dom_helper.addClass)(code_span, 'error_code');
  expectCall(test.dom_helper.appendChild)(code_span, code_text);
  expectCall(test.dom_helper.appendData)(code_text, error_code);
  if (after_error_code != null) {
    expectCall(test.dom_helper.appendChild)(code, after_text);
    expectCall(test.dom_helper.appendData)(after_text, after_error_code);
  }
};

PageOutputPanelTest.prototype.SetCompileErrorJustUnexpectedCharacter = function() {
  PageOutputPanelTest.setUpCompileErrorWithCodeSnippetExpectation(
    this, null, 'x', null);
  this.panel.setCompileError(
    'x', unlambda.parser.ERROR.UNEXPECTED_CHARACTER, 0);
};

PageOutputPanelTest.prototype.SetCompileErrorJustUnexpectedCharacter = function() {
  PageOutputPanelTest.setUpCompileErrorWithCodeSnippetExpectation(
    this, null, 'x', null);
  this.panel.setCompileError(
    'x', unlambda.parser.ERROR.UNEXPECTED_CHARACTER, 0);
};

PageOutputPanelTest.prototype.SetCompileErrorUnexpectedCharacterInMiddleShort = function() {
  PageOutputPanelTest.setUpCompileErrorWithCodeSnippetExpectation(
    this, '12345', 'x', '67890');
  this.panel.setCompileError(
    '12345x67890', unlambda.parser.ERROR.UNEXPECTED_CHARACTER, 5);
};

PageOutputPanelTest.prototype.SetCompileErrorUnexpectedCharacterInMiddleLong = function() {
  PageOutputPanelTest.setUpCompileErrorWithCodeSnippetExpectation(
    this, '...901234567890', 'x', '12345678901...');
  this.panel.setCompileError(
    '12345678901234567890x12345678901234567890',
    unlambda.parser.ERROR.UNEXPECTED_CHARACTER, 20);
};

PageOutputPanelTest.prototype.SetCompileErrorUnexpectedEOF = function() {
  expectCall(this.dom_helper.removeChildren)(this.panel.output_block);

  var span = {name: 'span'}, span_text = {name: 'span_text'};
  expectCall(this.dom_helper.createElement)('span').willOnce(returnWith(span));
  expectCall(this.dom_helper.createTextNode)().willOnce(returnWith(span_text));

  // <span class="error_message">xxx</span>
  expectCall(this.dom_helper.appendChild)(this.panel.output_block, span);
  expectCall(this.dom_helper.addClass)(span, 'error_message');
  expectCall(this.dom_helper.appendChild)(span, span_text);
  expectCall(this.dom_helper.appendData)(span_text, _);

  this.panel.setCompileError(
    '`i', unlambda.parser.ERROR.UNEXPECTED_EOF, 2);
};

PageOutputPanelTest.prototype.SetCompileErrorJustExtraCharacter = function() {
  PageOutputPanelTest.setUpCompileErrorWithCodeSnippetExpectation(
    this, null, 'x', null);
  this.panel.setCompileError(
    'x', unlambda.parser.ERROR.EXTRA_CHARACTER, 0);
};

PageOutputPanelTest.prototype.SetCompileErrorExtraCharacterShort = function() {
  PageOutputPanelTest.setUpCompileErrorWithCodeSnippetExpectation(
    this, '`ii', 'xxx', null);
  this.panel.setCompileError(
    '`iixxx', unlambda.parser.ERROR.EXTRA_CHARACTER, 3);
};

PageOutputPanelTest.prototype.SetCompileErrorExtraCharacterLong = function() {
  PageOutputPanelTest.setUpCompileErrorWithCodeSnippetExpectation(
    this, '...901234567890', '123456789012...', null);
  this.panel.setCompileError(
    '1234567890123456789012345678901234567890',
    unlambda.parser.ERROR.EXTRA_CHARACTER, 20);
};
