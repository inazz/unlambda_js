

var page = page || {};

// unlambda_app.App
// util.DomHelper
page.OutputPanel = function(app, dom_helper) {
  this.app = app;
  this.dom_helper = dom_helper;
  this.output_block = null;
  this.last_text_node = null;
  this.last_span_class_name = '';
};

page.OutputPanel.prototype.init = function() {
  this.output_block = this.dom_helper.get('output_block');
};

page.OutputPanel.prototype.clear = function() {
  this.dom_helper.removeChildren(this.output_block);
  this.last_text_node = null;
  this.last_span_class_name = '';
};

page.OutputPanel.prototype.appendOutput = function(str) {
  this.appendSpanTextWithClassName_('output', str);
};

page.OutputPanel.prototype.appendInputEchoBack = function(str) {
  this.appendSpanTextWithClassName_('echo_back', str);
};

page.OutputPanel.prototype.appendSpanTextWithClassName_ = function(classname, str) {
  if (this.last_span_class_name != classname) {
    var span = this.dom_helper.createElement('span');
    this.dom_helper.addClass(span, classname);
    this.dom_helper.appendChild(this.output_block, span);
    this.last_text_node = this.dom_helper.createTextNode();
    this.dom_helper.appendChild(span, this.last_text_node);
    this.last_span_class_name = classname;
  }
  this.dom_helper.appendData(this.last_text_node, str);
};

