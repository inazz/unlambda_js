
var util = util || {};

// Document
util.JsLoader = function(dom_helper) {
  this.dom_helper = dom_helper;
};

util.JsLoader.prototype.load = function(url) {
  var script_tag = this.dom_helper.createElement('script');
  this.dom_helper.setCharset(script_tag, 'utf-8');
  this.dom_helper.setSrc(script_tag, url);
  this.dom_helper.appendChild(this.dom_helper.getBody(), script_tag);
};
