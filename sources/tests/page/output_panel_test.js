
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
