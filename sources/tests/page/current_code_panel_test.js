
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

PageCurrentCodePanelTest.prototype.UpdateViewClearDomIfThereIsNoCode = function() {
  this.panel.show_mode = true;
  var ctx = this.app.getAppContext();
  ctx.runtime_context = null;
  expectCall(this.dom_helper.removeChildren)(
    this.panel.current_variable_block);

  this.panel.updateView();
};

PageCurrentCodePanelTest.prototype.UpdateViewClearDomIfShowNodeIsFalse = function() {
  this.panel.show_mode = false;
  var ctx = this.app.getAppContext();
  ctx.runtime_context = {}
  ctx.runtime_context.variable =
    new unlambda.Variable(unlambda.OP.I, null, null);

  expectCall(this.dom_helper.removeChildren)(
    this.panel.current_variable_block);

  this.panel.updateView();
};

PageCurrentCodePanelTest.prototype.UpdateViewCreateDomForVariable = function() {
  this.panel.show_mode = true;
  var ctx = this.app.getAppContext();
  ctx.runtime_context = {}
  // ` `ki ` ``s.a?b v
  ctx.runtime_context.variable =
    new unlambda.Variable(
      unlambda.OP.APPLY,
      new unlambda.Variable(
        unlambda.OP.K1,
        new unlambda.Variable(unlambda.OP.I, null, null),
        null),
      new unlambda.Variable(
        unlambda.OP.APPLY,
        new unlambda.Variable(
          unlambda.OP.S2,
          new unlambda.Variable(unlambda.OP.PRINT, "a", null),
          new unlambda.Variable(unlambda.OP.COMPARE, "b", null)),
        new unlambda.Variable(unlambda.OP.V, null, null)));
  ctx.runtime_context.next_apply =
    ctx.runtime_context.variable.v2;

  expectCall(this.dom_helper.removeChildren)(
    this.panel.current_variable_block);
  // <span>`<span>`ki</span><span>`<span>``s.a?b</span><span>v</span></span>
  var spans = [{}, {}, {}, {}, {}];
  var texts = [{}, {}, {}, {}, {}];
  expectCall(this.dom_helper.createElement)('span')
    .willOnce(returnWith(spans[0]))
    .willOnce(returnWith(spans[1]))
    .willOnce(returnWith(spans[2]))
    .willOnce(returnWith(spans[3]))
    .willOnce(returnWith(spans[4]));
  expectCall(this.dom_helper.createTextNode)()
    .willOnce(returnWith(texts[0]))
    .willOnce(returnWith(texts[1]))
    .willOnce(returnWith(texts[2]))
    .willOnce(returnWith(texts[3]))
    .willOnce(returnWith(texts[4]));
  expectCall(this.dom_helper.appendChild)(
    this.panel.current_variable_block, spans[0]);
  expectCall(this.dom_helper.appendChild)(spans[0], texts[0]);
  expectCall(this.dom_helper.appendChild)(spans[0], spans[1]);
  expectCall(this.dom_helper.appendChild)(spans[0], spans[2]);
  expectCall(this.dom_helper.appendChild)(spans[1], texts[1]);
  expectCall(this.dom_helper.appendChild)(spans[2], texts[2]);
  expectCall(this.dom_helper.appendChild)(spans[2], spans[3]);
  expectCall(this.dom_helper.appendChild)(spans[2], spans[4]);
  expectCall(this.dom_helper.appendChild)(spans[3], texts[3]);
  expectCall(this.dom_helper.appendChild)(spans[4], texts[4]);
  expectCall(this.dom_helper.appendData)(texts[0], "`");
  expectCall(this.dom_helper.appendData)(texts[1], "`k");
  expectCall(this.dom_helper.appendData)(texts[1], "i");
  expectCall(this.dom_helper.appendData)(texts[2], "`");
  expectCall(this.dom_helper.appendData)(texts[3], "``s");
  expectCall(this.dom_helper.appendData)(texts[3], ".a");
  expectCall(this.dom_helper.appendData)(texts[3], "?b");
  expectCall(this.dom_helper.appendData)(texts[4], "v");
  expectCall(this.dom_helper.addClass)(spans[2], "next_apply");
  this.panel.updateView();
};

PageCurrentCodePanelTest.prototype.UpdateViewCreateDomForVariableWithC1 = function() {
  this.panel.show_mode = true;
  var ctx = this.app.getAppContext();
  ctx.runtime_context = {}
  // `i <cont>
  var var_c1 = new unlambda.Variable(unlambda.OP.C1, null, null);

  ctx.runtime_context.variable = 
    new unlambda.Variable(
      unlambda.OP.APPLY,
      new unlambda.Variable(unlambda.OP.I, null, null),
      var_c1);
  var_c1.v1 = ctx.runtime_context.variable;
  ctx.runtime_context.next_apply = ctx.runtime_context.variable;

  expectCall(this.dom_helper.removeChildren)(
    this.panel.current_variable_block);
  // <span>`<span>i</span><span><cont></span></span>
  var spans = [{}, {}, {}];
  var texts = [{}, {}, {}];
  expectCall(this.dom_helper.createElement)('span')
    .willOnce(returnWith(spans[0]))
    .willOnce(returnWith(spans[1]))
    .willOnce(returnWith(spans[2]));
  expectCall(this.dom_helper.createTextNode)()
    .willOnce(returnWith(texts[0]))
    .willOnce(returnWith(texts[1]))
    .willOnce(returnWith(texts[2]));
  expectCall(this.dom_helper.appendChild)(
    this.panel.current_variable_block, spans[0]);
  expectCall(this.dom_helper.appendChild)(spans[0], texts[0]);
  expectCall(this.dom_helper.appendChild)(spans[0], spans[1]);
  expectCall(this.dom_helper.appendChild)(spans[0], spans[2]);
  expectCall(this.dom_helper.appendChild)(spans[1], texts[1]);
  expectCall(this.dom_helper.appendChild)(spans[2], texts[2]);
  expectCall(this.dom_helper.appendData)(texts[0], "`");
  expectCall(this.dom_helper.appendData)(texts[1], "i");
  expectCall(this.dom_helper.appendData)(texts[2], "<cont>");
  expectCall(this.dom_helper.addClass)(spans[0], "next_apply");
  this.panel.updateView();
};

