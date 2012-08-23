
function PageStatusPanelTest() {
  this.app = new unlambda_app.MockApp();
  this.dom_helper = createMockInstance(util.DomHelper);
  this.panel = new page.StatusPanel(this.app, this.dom_helper);
  this.app.status_panel = this.panel;
  this.panel.compile_error_block = {}; // status div block.
  this.panel.status_span = {};
  this.panel.step_span = {};
}
registerTestSuite(PageStatusPanelTest);

PageStatusPanelTest.prototype.InitGrabsDom = function() {
  var compile_error_block = {}, status_span = {}, step_span = {};
  expectCall(this.dom_helper.get)('compile_error_block')
    .willOnce(returnWith(compile_error_block));
  expectCall(this.dom_helper.get)('current_status')
    .willOnce(returnWith(status_span));
  expectCall(this.dom_helper.get)('current_step')
    .willOnce(returnWith(step_span));

  this.panel.init();
  expectEq(compile_error_block, this.panel.compile_error_block);
  expectEq(status_span, this.panel.status_span);
  expectEq(step_span, this.panel.step_span);
};

PageStatusPanelTest.prototype.SetCompileError = function() {
  this.panel.compile_error = {};

  this.panel.clear();
  expectEq(null, this.panel.compile_error);
};

PageStatusPanelTest.prototype.ClearRemovesCompileError = function() {
  this.panel.compile_error = {};

  this.panel.clear();
  expectEq(null, this.panel.compile_error);
};

PageStatusPanelTest.prototype.UpdateView = function() {
  this.panel.updateStatus_ = createMockFunction();
  this.panel.updateCompileError_ = createMockFunction();
  expectCall(this.panel.updateStatus_)();
  expectCall(this.panel.updateCompileError_)();
  this.panel.updateView();
};

PageStatusPanelTest.prototype.UpdateStatus = function() {
  var status_text_node = {}, step_text_node = {};
  this.app.app_context.run_state = unlambda_app.RUN_STATE.STOPPED;
  this.app.app_context.runtime_context = {step: 3};
  expectCall(this.dom_helper.removeChildren)(this.panel.status_span);
  expectCall(this.dom_helper.removeChildren)(this.panel.step_span);
  expectCall(this.dom_helper.createTextNode)()
    .willOnce(returnWith(status_text_node))
    .willOnce(returnWith(step_text_node));
  expectCall(this.dom_helper.appendChild)(
    this.panel.status_span, status_text_node);
  expectCall(this.dom_helper.appendChild)(
    this.panel.step_span, step_text_node);
  expectCall(this.dom_helper.appendData)(status_text_node, "STOPPED");
  expectCall(this.dom_helper.appendData)(step_text_node, "3");

  this.panel.updateStatus_();
};


// PageStatusPanelTest, string?, string, string?
PageStatusPanelTest.setUpCompileErrorWithCodeSnippetExpectation = function(
  test, before_error_code, error_code, after_error_code) {
  expectCall(test.dom_helper.removeChildren)(test.panel.compile_error_block);

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
  expectCall(test.dom_helper.appendChild)(
    test.panel.compile_error_block, span);
  expectCall(test.dom_helper.addClass)(span, 'error_message');
  expectCall(test.dom_helper.appendChild)(span, span_text);
  expectCall(test.dom_helper.appendData)(span_text, _);

  // <code class="error_snippet">
  //   BEFORE<span class="error_code">CODE</span>AFTER
  // </code>
  expectCall(test.dom_helper.appendChild)(test.panel.compile_error_block, code);
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

PageStatusPanelTest.prototype.UpdateCompileError_JustUnexpectedCharacter = function() {
  PageStatusPanelTest.setUpCompileErrorWithCodeSnippetExpectation(
    this, null, 'x', null);
  this.panel.compile_error = {};
  this.panel.compile_error.code = 'x';
  this.panel.compile_error.error = unlambda.parser.ERROR.UNEXPECTED_CHARACTER;
  this.panel.compile_error.error_pos = 0;
  this.panel.updateCompileError_();
};

PageStatusPanelTest.prototype.UpdateCompileError_UnexpectedCharacterInMiddleShort = function() {
  PageStatusPanelTest.setUpCompileErrorWithCodeSnippetExpectation(
    this, '12345', 'x', '67890');
  this.panel.compile_error = {};
  this.panel.compile_error.code = '12345x67890';
  this.panel.compile_error.error = unlambda.parser.ERROR.UNEXPECTED_CHARACTER;
  this.panel.compile_error.error_pos = 5;
  this.panel.updateCompileError_();
};

PageStatusPanelTest.prototype.UpdateCompileError_UnexpectedCharacterInMiddleLong = function() {
  PageStatusPanelTest.setUpCompileErrorWithCodeSnippetExpectation(
    this, '...901234567890', 'x', '12345678901...');
  this.panel.compile_error = {};
  this.panel.compile_error.code = '12345678901234567890x12345678901234567890';
  this.panel.compile_error.error = unlambda.parser.ERROR.UNEXPECTED_CHARACTER;
  this.panel.compile_error.error_pos = 20;
  this.panel.updateCompileError_();
};

PageStatusPanelTest.prototype.UpdateCompileError_UnexpectedEOF = function() {
  expectCall(this.dom_helper.removeChildren)(this.panel.compile_error_block);

  var span = {name: 'span'}, span_text = {name: 'span_text'};
  expectCall(this.dom_helper.createElement)('span').willOnce(returnWith(span));
  expectCall(this.dom_helper.createTextNode)().willOnce(returnWith(span_text));

  // <span class="error_message">xxx</span>
  expectCall(this.dom_helper.appendChild)(
    this.panel.compile_error_block, span);
  expectCall(this.dom_helper.addClass)(span, 'error_message');
  expectCall(this.dom_helper.appendChild)(span, span_text);
  expectCall(this.dom_helper.appendData)(span_text, _);

  this.panel.compile_error = {};
  this.panel.compile_error.code = '`i';
  this.panel.compile_error.error = unlambda.parser.ERROR.UNEXPECTED_EOF;
  this.panel.compile_error.error_pos = 2;
  this.panel.updateCompileError_();
};

PageStatusPanelTest.prototype.UpdateCompileError_JustExtraCharacter = function() {
  PageStatusPanelTest.setUpCompileErrorWithCodeSnippetExpectation(
    this, null, 'x', null);
  this.panel.compile_error = {};
  this.panel.compile_error.code = 'x';
  this.panel.compile_error.error = unlambda.parser.ERROR.EXTRA_CHARACTER;
  this.panel.compile_error.error_pos = 0;
  this.panel.updateCompileError_();
};

PageStatusPanelTest.prototype.UpdateCompileError_ExtraCharacterShort = function() {
  PageStatusPanelTest.setUpCompileErrorWithCodeSnippetExpectation(
    this, '`ii', 'xxx', null);
  this.panel.compile_error = {};
  this.panel.compile_error.code = '`iixxx';
  this.panel.compile_error.error = unlambda.parser.ERROR.EXTRA_CHARACTER;
  this.panel.compile_error.error_pos = 3;
  this.panel.updateCompileError_();
};

PageStatusPanelTest.prototype.UpdateCompileError_ExtraCharacterLong = function() {
  PageStatusPanelTest.setUpCompileErrorWithCodeSnippetExpectation(
    this, '...901234567890', '123456789012...', null);
  this.panel.compile_error = {};
  this.panel.compile_error.code = '1234567890123456789012345678901234567890';
  this.panel.compile_error.error = unlambda.parser.ERROR.EXTRA_CHARACTER;
  this.panel.compile_error.error_pos = 20;
  this.panel.updateCompileError_();
};
