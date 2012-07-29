

var util = {};

// Document
util.DomHelper = function(doc) {
  this.doc = doc;
};

util.DomHelper.prototype.get = function (id) {
  return this.doc.getElementById(id);
};

util.DomHelper.prototype.setEventListener = function (dom, type, obj, func) {
  dom.addEventListener(
    type, function() { return func.apply(obj, arguments);}, true);
};
