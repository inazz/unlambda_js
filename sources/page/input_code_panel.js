

var page = page || {};

// unlambda_app.App, util.DomHelper
page.InputCodePanel = function(app, dom_helper, js_loader) {
  this.app = app;
  this.dom_helper = dom_helper;
  this.js_loader = js_loader;
  this.code_area = null;
  this.code_selector = null;
};

page.InputCodePanel.HELLO_WORLD_CODE = "`````````````.H.e.l.l.o.,. .w.o.r.l.d.!i";
page.InputCodePanel.HELLO_WORLD_SHORT_CODE = "`.!`.d`.l`.r``.w`. `.,``.l`c`.H.e.oi";
page.InputCodePanel.ADVENTURE_CODE = ""; // delay load.
page.InputCodePanel.ADVENTURE_LOADER_URL =
  'https://raw.github.com/inazz/unlambda_js/master/html/adventure_loader.js';
page.InputCodePanel.LOADING_MESSAGE = "Loading...";

page.InputCodePanel.prototype.init = function() {
  this.code_area = this.dom_helper.get('code');
  this.code_selector = this.dom_helper.get('code_selector');
  this.dom_helper.addEventListener(
    this.code_area, 'keydown', this, this.onCodeChange);
  this.dom_helper.addEventListener(
    this.code_area, 'change', this, this.onCodeChange);
  this.dom_helper.addEventListener(
    this.code_selector, 'change', this, this.onSelectorChange);
};

page.InputCodePanel.prototype.getCode = function() {
  return this.dom_helper.getValue(this.code_area);
};

page.InputCodePanel.prototype.onCodeChange = function(ev) {
  if (this.dom_helper.getValue(this.code_selector) != "") {
    this.dom_helper.setValue(this.code_selector, "");
  }
};

page.InputCodePanel.prototype.onSelectorChange = function(ev) {
  var sample_name = this.dom_helper.getValue(this.code_selector);
  if (sample_name == "hello_world") {
    this.dom_helper.setValue(
      this.code_area, page.InputCodePanel.HELLO_WORLD_CODE);
  } else if (sample_name == "hello_world_short") {
    this.dom_helper.setValue(
      this.code_area, page.InputCodePanel.HELLO_WORLD_SHORT_CODE);
  } else if (sample_name == "adventure") {
    if (page.InputCodePanel.ADVENTURE_CODE == "") {
      this.dom_helper.setValue(
        this.code_area, page.InputCodePanel.LOADING_MESSAGE);
      this.js_loader.load(page.InputCodePanel.ADVENTURE_LOADER_URL);
    } else {
      this.dom_helper.setValue(
        this.code_area, page.InputCodePanel.ADVENTURE_CODE);
    }
  }
};

page.InputCodePanel.prototype.onAdventureLoadComplete = function(code) {
  page.InputCodePanel.ADVENTURE_CODE = code;
  this.onSelectorChange();
};

page.InputCodePanel.prototype.updateView = function() {
  var ctx = this.app.getAppContext();
  if (ctx.run_state == unlambda_app.RUN_STATE.STOPPED) {
    this.dom_helper.enable(this.code_selector, true);
    this.dom_helper.enable(this.code_area, true);
  } else {
    this.dom_helper.enable(this.code_selector, false);
    this.dom_helper.enable(this.code_area, false);
  }
};
