

var page = page || {};

// util.DomHelper
// function(page.App, util.DomHelper): page.ControlPanel
page.App = function(domHelper, panelFactory) {
  this.domHelper = domHelper;
  this.controlPanel = panelFactory['control'](this, domHelper);
  this.codePanel = panelFactory['code'](this, domHelper);
  this.inputPanel = panelFactory['input'](this, domHelper);
  this.outputPanel = panelFactory['output'](this, domHelper);
};

// Document
page.App.create = function(doc){
  var domHelper = new util.DomHelper(doc);
  var panelFactory = {
    'control': function(app, domHelper) {
      return new page.ControlPanel(app, domHelper);},
    'code': function(app, domHelper) {
      return new page.CodePanel(app, domHelper);},
    'input': function(app, domHelper) {
      return new page.InputPanel(app, domHelper);},
    'output': function(app, domHelper) {
      return new page.OutputPanel(app, domHelper);},
  };
  return new page.App(domHelper, panelFactory);
}

page.App.prototype.init = function() {
  this.controlPanel.init();
  this.codePanel.init();
  this.inputPanel.init();
  this.outputPanel.init();
};
