

var page = page || {};

page.App = function(doc) {
  this.doc = doc;
  this.controlPanel = new page.ControlPanel(this, doc);
  this.codePanel = new page.CodePanel(this, doc);
  this.inputPanel = new page.InputPanel(this, doc);
};

page.App.prototype.init = function() {

};
