

var util = util || {};

// Document
util.DomHelper = function(doc) {
  this.doc = doc;
};

// String
util.DomHelper.prototype.get = function(id) {
  return this.doc.getElementById(id);
};

// HtmlElement, String, Object, function(Event)
util.DomHelper.prototype.addEventListener = function(dom, type, obj, func) {
  dom.addEventListener(
    type, function() { return func.apply(obj, arguments);}, true);
};

// HtmlElement
util.DomHelper.prototype.getValue = function(dom) {
  return dom.value;
};

// HtmlElement, string
util.DomHelper.prototype.setValue = function(dom, str) {
  return dom.value = str;
};

// String
util.DomHelper.prototype.createElement = function(name) {
  return this.doc.createElement(name);
};

util.DomHelper.prototype.createTextNode = function() {
  var node = this.doc.createTextNode('');
  return node;
};

// HtmlElement(TextNode), String
util.DomHelper.prototype.appendData = function(textNode, str) {
  textNode.appendData(str);
};

// HtmlElement, HtmlElement
util.DomHelper.prototype.appendChild = function(parentNode, childNode) {
  parentNode.appendChild(childNode);
};

// HtmlElement
util.DomHelper.prototype.removeChildren = function(dom) {
  while (dom.hasChildNodes()) {
    dom.removeChild(dom.firstChild);
  }
};

// HtmlElement
util.DomHelper.prototype.addClass = function(dom, str) {
  var cls = dom.className || "";
  if (cls.length != 0) {
    cls += " ";
  }
  dom.className =  cls + str;
};

// HtmlElement, boolean
util.DomHelper.prototype.enable = function(dom, flag) {
  dom.disabled = !flag;
};

// HtmlElement
util.DomHelper.prototype.isChecked = function(dom) {
  return !!dom.checked
};
