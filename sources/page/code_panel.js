

var page = page || {};

// unlambda_app.App, util.DomHelper
page.CodePanel = function(app, dom_helper) {
  this.app = app;
  this.dom_helper = dom_helper;
  this.code_area = null;
};

page.CodePanel.prototype.init = function() {
  this.code_area = this.dom_helper.get('code');
};

page.CodePanel.prototype.getCode = function() {
  return this.dom_helper.getValue(this.code_area);
};
