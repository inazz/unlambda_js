
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
  this.panel.last_text_node = {};
  this.panel.last_span_class_name = 'hoge';

  this.panel.clear();
  expectNe(null, this.panel.output_block);
  expectEq(null, this.panel.last_text_node);
  expectEq('', this.panel.last_span_class_name);
};

PageOutputPanelTest.prototype.AppendOutputCreatesSpanOnce = function() {
  var span = {}, text_node = {};

  expectCall(this.dom_helper.createElement)('span').willOnce(returnWith(span));
  expectCall(this.dom_helper.addClass)(span, 'output');
  expectCall(this.dom_helper.createTextNode)().willOnce(returnWith(text_node));
  expectCall(this.dom_helper.appendChild)(this.panel.output_block, span);
  expectCall(this.dom_helper.appendChild)(span, text_node);
  expectCall(this.dom_helper.appendData)(text_node, 'hoge');
  expectCall(this.dom_helper.scrollToBottom)(this.panel.output_block);
  this.panel.appendOutput('hoge');

  expectCall(this.dom_helper.appendData)(text_node, 'fuga');
  expectCall(this.dom_helper.scrollToBottom)(this.panel.output_block);
  this.panel.appendOutput('fuga');
};

PageOutputPanelTest.prototype.AppendInputEchoBackCreatesSpanOnce = function() {
  var span = {}, text_node = {};

  expectCall(this.dom_helper.createElement)('span').willOnce(returnWith(span));
  expectCall(this.dom_helper.addClass)(span, 'echo_back');
  expectCall(this.dom_helper.createTextNode)().willOnce(returnWith(text_node));
  expectCall(this.dom_helper.appendChild)(this.panel.output_block, span);
  expectCall(this.dom_helper.appendChild)(span, text_node);
  expectCall(this.dom_helper.appendData)(text_node, 'hoge');
  expectCall(this.dom_helper.scrollToBottom)(this.panel.output_block);
  this.panel.appendInputEchoBack('hoge');

  expectCall(this.dom_helper.appendData)(text_node, 'fuga');
  expectCall(this.dom_helper.scrollToBottom)(this.panel.output_block);
  this.panel.appendInputEchoBack('fuga');
};

PageOutputPanelTest.prototype.OutputCreatesNewSpanWhenClassNameChanged = function() {
  var span1 = {}, span2 = {}, span3 = {};
  var text_node1 = {}, text_node2 = {}, text_node3 = {};

  expectCall(this.dom_helper.createElement)('span')
    .willOnce(returnWith(span1))
    .willOnce(returnWith(span2))
    .willOnce(returnWith(span3));
  expectCall(this.dom_helper.createTextNode)()
    .willOnce(returnWith(text_node1))
    .willOnce(returnWith(text_node2))
    .willOnce(returnWith(text_node3));
  expectCall(this.dom_helper.addClass)(span1, 'output');
  expectCall(this.dom_helper.appendChild)(this.panel.output_block, span1);
  expectCall(this.dom_helper.appendChild)(span1, text_node1);
  expectCall(this.dom_helper.appendData)(text_node1, 'a');

  expectCall(this.dom_helper.addClass)(span2, 'echo_back');
  expectCall(this.dom_helper.appendChild)(this.panel.output_block, span2);
  expectCall(this.dom_helper.appendChild)(span2, text_node2);
  expectCall(this.dom_helper.appendData)(text_node2, 'b');

  expectCall(this.dom_helper.addClass)(span3, 'output');
  expectCall(this.dom_helper.appendChild)(this.panel.output_block, span3);
  expectCall(this.dom_helper.appendChild)(span3, text_node3);
  expectCall(this.dom_helper.appendData)(text_node3, 'c');

  expectCall(this.dom_helper.scrollToBottom)(this.panel.output_block).times(3);

  this.panel.appendOutput('a');
  this.panel.appendInputEchoBack('b');
  this.panel.appendOutput('c');
};
