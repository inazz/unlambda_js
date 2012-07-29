

var util = {};

// Document
util.DomHelper = function(doc) {
  this.doc = doc;
};

// String
util.DomHelper.prototype.get = function(id) {
  return this.doc.getElementById(id);
};

// HtmlElement, String, Object, function(Event)
util.DomHelper.prototype.setEventListener = function(dom, type, obj, func) {
  dom.addEventListener(
    type, function() { return func.apply(obj, arguments);}, true);
};

// HtmlElement
util.DomHelper.prototype.getValue = function(dom) {
  return dom.value;
};
