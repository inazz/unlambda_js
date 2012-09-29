// unlambda.js
// https://github.com/inazz/unlambda_js

var util = util || {};

util.LoopThread = function(window, f) {
  this.window = window;
  this.f = f;
  this.interval = util.LoopThread.defaultInterval;
  this.running = false;
  var that = this;
  this.main_callback = function () {that.run_();};
};

util.LoopThread.defaultInterval = 0;

util.LoopThread.prototype.setInterval = function(time_ms) {
  this.interval = time_ms;
};

util.LoopThread.prototype.isRunning = function() {
  return this.running;
};

util.LoopThread.prototype.run = function() {
  if (!this.isRunning()) {
    this.running = true;
    this.window.setTimeout(this.main_callback, this.interval);
  }
};

util.LoopThread.prototype.run_ = function() {
  var res = this.f();
  if (res) {
    this.window.setTimeout(this.main_callback, this.interval);
  } else {
    this.running = false;
  }
};
var unlambda_app = unlambda_app || {};

unlambda_app.RUN_MODE = {
  RUN: 0,
  RUN_STEP: 1,
};


var unlambda = unlambda || {};

unlambda.OP = {  // comments are expected Variable.v1 and v2.
  APPLY:   '`',  // not evluated variable, not evaluated variable
  S:       's',
  S1:      '`s', // variable
  S2:      '``s', // variable, variable
  K:       'k',
  K1:      '`k', // variable
  I:       'i',
  V:       'v',
  C:       'c',
  C1:      '`c', // root_variable
  D:       'd',
  D1:      '`d', // not evaluated variable
  PRINT:   '.',  // string of length 1
  E:       'e',
  READ:    '@',
  COMPARE: '?',  // string of length 1
  REPRINT: '|',
};


var util = util || {};

// Document
util.DomHelper = function(doc) {
  this.doc = doc;
};

// String
util.DomHelper.prototype.get = function(id) {
  return this.doc.getElementById(id);
};

util.DomHelper.prototype.getBody = function() {
  return this.doc.body;
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

// HtmlElement
util.DomHelper.prototype.setDisplay = function(dom, value) {
  if (typeof(dom.style) == 'undefined')
    dom.style = {};
  dom.style.display = value;
};

// HtmlElement
util.DomHelper.prototype.setCharset = function(dom, charset) {
  dom.charset = charset;
};

// HtmlElement
util.DomHelper.prototype.setSrc = function(dom, src) {
  dom.src = src;
};

// HtmlElement
util.DomHelper.prototype.scrollToBottom = function(dom) {
  dom.scrollTop = dom.scrollHeight;
};

var unlambda_app = unlambda_app || {};

unlambda_app.RUN_STATE = {
  STOPPED: 0,
  PAUSED: 1,
  RUNNING: 2,
  INPUT_WAIT: 3,
};
unlambda_app.RUN_STATE.toString = function(state) {
  return ['STOPPED', 'PAUSED', 'RUNNING', 'INPUT_WAIT'][state];
};
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


var unlambda = unlambda || {};
unlambda.variable = unlambda.variable || {};

unlambda.variable.nextId = 0;

// op -- unlambda.OP
// v1 -- null or unlambda.Code
// v2 -- null or unlambda.Code
unlambda.Variable = function(op, v1, v2) {
  this.id = unlambda.variable.nextId++;
  this.op = op;
  this.v1 = v1;
  this.v2 = v2;
};

var util = util || {};

util.LoopThreadFactory = function(window) {
  this.window = window;
};

util.LoopThreadFactory.prototype.create = function(f) {
  return new util.LoopThread(this.window, f);
};


var page = page || {};

// unlambda_app.App
// util.DomHelper
page.StatusPanel = function(app, dom_helper) {
  this.app = app;
  this.dom_helper = dom_helper;
  this.compile_error = null;
  this.status_span = null;
  this.step_span = null;
};

page.StatusPanel.prototype.init = function() {
  this.compile_error_block = this.dom_helper.get('compile_error_block');
  this.status_span = this.dom_helper.get('current_status');
  this.step_span = this.dom_helper.get('current_step');
};

page.StatusPanel.prototype.clear = function() {
  this.compile_error = null;
};

// string, unlambda.parser.ERROR, int
page.StatusPanel.prototype.setCompileError = function(code, err, err_pos) {
  this.compile_error = {};
  this.compile_error.code = code;
  this.compile_error.error = err;
  this.compile_error.error_pos = err_pos;
};

page.StatusPanel.prototype.updateView = function() {
  this.updateStatus_();
  this.updateCompileError_();
};

page.StatusPanel.prototype.updateStatus_ = function() {
  var ctx = this.app.getAppContext();

  this.dom_helper.removeChildren(this.status_span);
  var status_text = this.dom_helper.createTextNode();
  this.dom_helper.appendChild(this.status_span, status_text);
  this.dom_helper.appendData(
    status_text, unlambda_app.RUN_STATE.toString(ctx.run_state));

  this.dom_helper.removeChildren(this.step_span);
  var step_text = this.dom_helper.createTextNode();
  this.dom_helper.appendChild(this.step_span, step_text);
  this.dom_helper.appendData(
    step_text, "" + this.getCurrentStepForStatus(ctx));
};

page.StatusPanel.prototype.getCurrentStepForStatus = function(ctx) {
  if (ctx.runtime_context) {
    return ctx.runtime_context.step;
  } else {
    return 0;
  }
};

page.StatusPanel.prototype.updateCompileError_ = function() {
  var err = this.compile_error;
  this.dom_helper.removeChildren(this.compile_error_block);
  if (err) {
    this.addCompileErrorMessage_(err.error, err.error_pos);
    this.maybeAddCodeSnippet_(err.code, err.error, err.error_pos);
  }
};

page.StatusPanel.prototype.addCompileErrorMessage_ = function(err, err_pos) {
  var span = this.dom_helper.createElement('span');
  this.dom_helper.appendChild(this.compile_error_block, span);
  this.dom_helper.addClass(span, 'error_message');
  var text_node = this.dom_helper.createTextNode();
  this.dom_helper.appendChild(span, text_node);
  var str = "";
  switch (err) {
  case unlambda.parser.ERROR.UNEXPECTED_CHARACTER:
    str = 'Unexpected character at position ' + err_pos + '.';
    break;
  case unlambda.parser.ERROR.UNEXPECTED_EOF:
    str = 'Unexpected end of code!';
    break;
  case unlambda.parser.ERROR.EXTRA_CHARACTER:
    str = 'Excess string after valid code.';
    break;
  default:
    throw 'unexpected code path.';
  }
  this.dom_helper.appendData(text_node, str);
};

page.StatusPanel.prototype.maybeAddCodeSnippet_ = function(code, err, err_pos) {
  var char_err = true;
  switch (err) {
  case unlambda.parser.ERROR.UNEXPECTED_CHARACTER:
    break;
  case unlambda.parser.ERROR.UNEXPECTED_EOF:
    return; // no code snippet.
  case unlambda.parser.ERROR.EXTRA_CHARACTER:
    char_err = false;
    break;
  default:
    throw 'unexpected code path.';
  }
  var before_max_len = 15;
  var dots = '...';
  var after_max_len = 15;
  var code_node = this.dom_helper.createElement('code');
  this.dom_helper.addClass(code_node, 'error_snippet');
  this.dom_helper.appendChild(this.compile_error_block, code_node);
  if (err_pos != 0) {
    var text_node = this.dom_helper.createTextNode();
    this.dom_helper.appendChild(code_node, text_node);
    var str = '';
    if (err_pos <= before_max_len) {
      str = code.substring(0, err_pos);
    } else {
      str = dots + code.substring(err_pos - before_max_len + dots.length,
                                  err_pos);
    }
    this.dom_helper.appendData(text_node, str);
  }
  if (err_pos != code.length) {
    var str = '';
    var remaining = code.length - err_pos;
    if (remaining <= after_max_len) {
      str = code.substring(err_pos);
    } else {
      str =
        code.substring(err_pos, err_pos + after_max_len - dots.length) + dots;
    }
    var err_span = this.dom_helper.createElement('span');
    this.dom_helper.appendChild(code_node, err_span);
    this.dom_helper.addClass(err_span, 'error_code');
    var text_node = this.dom_helper.createTextNode();
    this.dom_helper.appendChild(err_span, text_node);
    if (char_err) {
      this.dom_helper.appendData(text_node, str.substring(0, 1));
      if (str.length != 1) {
        var text_node = this.dom_helper.createTextNode();
        this.dom_helper.appendChild(code_node, text_node);
        this.dom_helper.appendData(text_node, str.substring(1));
      }
    } else {
      this.dom_helper.appendData(text_node, str);
    }
  }
};


var page = page || {};

// unlambda_app.App, util.DomHelper
page.ControlPanel = function(app, dom_helper) {
  this.app = app;
  this.dom_helper = dom_helper;
  this.buttons = {};
  this.last_clicked_name = '';
};

page.ControlPanel.prototype.init = function() {
  this.buttons['stop'] = this.dom_helper.get('stop');
  this.buttons['pause'] = this.dom_helper.get('pause');
  this.buttons['run'] = this.dom_helper.get('run');
  this.buttons['run_step'] = this.dom_helper.get('run_step');
  this.buttons['step'] = this.dom_helper.get('step');
  this.dom_helper.addEventListener(
    this.buttons['stop'], 'click', this, this.onStopButtonClick);
  this.dom_helper.addEventListener(
    this.buttons['pause'], 'click', this, this.onPauseButtonClick);
  this.dom_helper.addEventListener(
    this.buttons['run'], 'click', this, this.onRunButtonClick);
  this.dom_helper.addEventListener(
    this.buttons['run_step'], 'click', this, this.onRunStepButtonClick);
  this.dom_helper.addEventListener(
    this.buttons['step'], 'click', this, this.onStepButtonClick);
};

page.ControlPanel.prototype.onStopButtonClick = function(e) {
  this.last_clicked_name = 'stop';
  this.app.getController().stop();
};
page.ControlPanel.prototype.onPauseButtonClick = function(e) {
  this.last_clicked_name = 'pause';
  this.app.getController().pause();
};
page.ControlPanel.prototype.onRunButtonClick = function(e) {
  this.last_clicked_name = 'run';
  this.app.getController().setThreadWaitInterval(0);
  this.app.getController().run(unlambda_app.RUN_MODE.RUN, -1);
};
page.ControlPanel.prototype.onRunStepButtonClick = function(e) {
  this.last_clicked_name = 'run_step';
  this.app.getController().setThreadWaitInterval(1000);
  this.app.getController().run(unlambda_app.RUN_MODE.RUN_STEP, -1);
};
page.ControlPanel.prototype.onStepButtonClick = function(e) {
  this.last_clicked_name = 'step';
  this.app.getController().setThreadWaitInterval(0);
  this.app.getController().run(unlambda_app.RUN_MODE.RUN,
                               this.app.getAppContext().getCurrentStep() + 1);
};

page.ControlPanel.prototype.updateView = function() {
  var ctx = this.app.getAppContext();
  var disabledButtons = {};

  switch(ctx.run_state) {
  case unlambda_app.RUN_STATE.STOPPED:
    disabledButtons['stop'] = 1;
    disabledButtons['pause'] = 1;
    break;
  case unlambda_app.RUN_STATE.PAUSED:
    disabledButtons['pause'] = 1;
    break;
  case unlambda_app.RUN_STATE.RUNNING:
  case unlambda_app.RUN_STATE.INPUT_WAIT:
    disabledButtons[this.last_clicked_name] = 1;
    break;
  default:
    throw 'unexpected state.';
  }
  for (name in this.buttons) {
    this.dom_helper.enable(this.buttons[name], !(name in disabledButtons));
  }
};


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
  this.dom_helper.scrollToBottom(this.output_block);
};

page.OutputPanel.prototype.appendInputEchoBack = function(str) {
  this.appendSpanTextWithClassName_('echo_back', str);
  this.dom_helper.scrollToBottom(this.output_block);
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
page.InputCodePanel.ECHO_CODE = "```sii```si`k`ci`@|";
page.InputCodePanel.ECHO_SHORT_CODE = "``ci`c`@|";
page.InputCodePanel.ADVENTURE_CODE = ""; // delay load.
page.InputCodePanel.ADVENTURE_LOADER_URL = './adventure_loader.js';
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
  } else if (sample_name == "echo") {
    this.dom_helper.setValue(
      this.code_area, page.InputCodePanel.ECHO_CODE);
  } else if (sample_name == "echo_short") {
    this.dom_helper.setValue(
      this.code_area, page.InputCodePanel.ECHO_SHORT_CODE);
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


var unlambda = unlambda || {};
unlambda.parser = unlambda.parser || {};

unlambda.parser.ParseResult = function() {
  this.sucess = false;
  this.variable = null; // unlambda.Variable
  this.error = null; // unlambda.parser.ERROR
  this.error_pos = -1;
};

unlambda.parser.ERROR = {
  UNEXPECTED_CHARACTER: 1,
  UNEXPECTED_EOF: 2,
  EXTRA_CHARACTER: 3,
};

unlambda.parser.ParseContext = function(code) {
  this.code = code; // string
  this.cur = 0;
  this.end = code.length;
  this.variable = null; // unlambda.Variable
  this.error = null; // unlambda.parser.ERROR
};


// code -- string
// return unlambda.parser.Result
unlambda.parser.parse = function(code) {
  var ctx = new unlambda.parser.ParseContext(code);
  this.parse_(ctx);
  if (ctx.error === null) {
    ctx.cur = this.findEndOfComment(ctx.code, ctx.cur, ctx.end);
    if (ctx.cur != ctx.end) {
      ctx.error = unlambda.parser.ERROR.EXTRA_CHARACTER;
    }
  }
  var res = new unlambda.parser.ParseResult();
  res.success = (ctx.error === null);
  res.variable = ctx.variable;
  if (!res.success) {
    res.error = ctx.error;
    res.error_pos = ctx.cur;
  }
  return res;
};

// ctx -- unlambda.parser.ParseContext.
unlambda.parser.parse_ = function(ctx) {
  ctx.cur = this.findEndOfComment(ctx.code, ctx.cur, ctx.end);
  if (ctx.cur == ctx.end) {
    ctx.error = unlambda.parser.ERROR.UNEXPECTED_EOF;
    return;
  }
  var c = ctx.code.charAt(ctx.cur);
  if (c == "`") {
    ctx.cur++;
    this.parse_(ctx);
    if (ctx.error !== null)
      return;
    var v1 = ctx.variable;
    ctx.variable = null;
    this.parse_(ctx);
    if (ctx.error !== null)
      return;
    ctx.variable = new unlambda.Variable(c, v1, ctx.variable);
  } else if ("skivcde@|".indexOf(c) != -1) {
    ctx.variable = new unlambda.Variable(c, null, null);
    ctx.cur++;
  } else if (".?".indexOf(c) != -1) {
    if (ctx.cur + 1 == ctx.end) {
      ctx.error = unlambda.parser.ERROR.UNEXPECTED_EOF;
    } else {
      ctx.variable =
        new unlambda.Variable(c, ctx.code.charAt(ctx.cur + 1), null);
      ctx.cur += 2;
    }
  } else if (c == "r") {
    ctx.variable = new unlambda.Variable(".", "\n", null);
    ctx.cur++;
  } else {
    ctx.error = unlambda.parser.ERROR.UNEXPECTED_CHARACTER;
  }
};


// return first non-comment charactor position between 'start' and 'end' in
// 'code'.
// code -- string
// start -- int
// return -- int
unlambda.parser.findEndOfComment = function(code, start, end) {
  var cur = start;
  while (cur != end) {
    var c = code.charAt(cur);
    if (" \t\r\n".indexOf(c) != -1) {
      cur++;
    } else if (c == "#") {
      cur = code.indexOf("\n", cur+1);
      if (cur == -1 || cur > end) {
        cur = end;
      }
    } else {
      break; 
    }
  }
  return cur;
};


var unlambda = unlambda || {};
unlambda.runtime = unlambda.runtime || {};

// inputCallback is a function take no argument and return string.
// it will be called when '@' is called.
// it should return single character string to give next input character,
// unlambda.runtime.IO_CODE.EOF when EOF, or BLOCK when input is blocking.
// when the input is bloked.
//
// outputCallback is a function take one character string.
// it will be called when '.x' is called.
unlambda.runtime.IO = function(inputCallback, outputCallback) {
  this.input = inputCallback; // function(): string
  this.output = outputCallback; // function(string)
};

unlambda.runtime.IO_CODE = {
  EOF: '',
  BLOCK: 'BL',
};

unlambda.runtime.STATE = {
  RUNNING: 0,
  EXITED: 1,
  INPUT_WAIT: 2,
  STEP_LIMIT: 3,
  C_BREAK: 4,
  C1_BREAK: 5,
};

// variable -- unlambda.Variable
unlambda.runtime.RuntimeContext = function(variable, io) {
  this.original_variable = variable; // unlambda.Variable
  this.variable = variable; // unlambda.Variable
  this.io = io; // unlambda.runtime.IO
  this.current_character = unlambda.runtime.IO_CODE.EOF; // string
  this.step = 0; // int
  this.step_limit = -1; // int
  this.state = unlambda.runtime.STATE.RUNNING;
  // This object only exist when result state is INPUT_WAIT or STEP_LIMIT.
  this.next_apply = null; // unlambda.Variable.

  // for temporary use while run().
  this.current_variable = null; // unlambda.Variable
  this.exit_arg = null; // unlambda.Variable
  this.event_c1 = null; // unlambda.Variable
  this.c1_result = null; // unlambda.Variable
};

// ctx -- unlambda.runtime.RuntimeContext
unlambda.runtime.run = function(ctx) {
  if (ctx.state == unlambda.runtime.STATE.EXITED) {
    return;
  }
  ctx.state = unlambda.runtime.STATE.RUNNING;
  ctx.next_apply = null;
  while (ctx.state == unlambda.runtime.STATE.RUNNING) {
    ctx.current_variable = ctx.variable;
    this.eval_(ctx);
    ctx.variable = ctx.current_variable;
    switch (ctx.state) {
    case unlambda.runtime.STATE.EXITED:
      ctx.variable = ctx.exit_arg;
      ctx.exit_arg = null;
      break;
    case unlambda.runtime.STATE.RUNNING:
      ctx.state = unlambda.runtime.STATE.EXITED;
      break;
    case unlambda.runtime.STATE.C_BREAK:
      ctx.event_c1.v1 = ctx.variable;
      ctx.event_c1 = null;
      ctx.state = unlambda.runtime.STATE.RUNNING;
      break;
    case unlambda.runtime.STATE.C1_BREAK:
      ctx.variable = ctx.event_c1.v1;
      ctx.state = unlambda.runtime.STATE.RUNNING;
      break;
    }
  }
};

unlambda.runtime.eval_ = function(ctx) {
  var cur = ctx.current_variable;
  if (cur.op != unlambda.OP.APPLY) {
    return;
  }
  if (ctx.c1_result !== null && cur.v2 === ctx.event_c1) {
    // resuming from `<cont>X
    ctx.current_variable = ctx.c1_result;
    ctx.c1_result = null;
    ctx.event_c1 = null;
    return;
  }
  ctx.current_variable = cur.v1;
  this.eval_(ctx);
  var v1 = ctx.current_variable;
  if (ctx.state != unlambda.runtime.STATE.RUNNING) {
    ctx.current_variable = new unlambda.Variable(cur.op, v1, cur.v2);
    return;
  }
  ctx.current_variable = cur.v2;
  if (v1.op != unlambda.OP.D) {
    this.eval_(ctx);
  }
  var v2 = ctx.current_variable;
  if (ctx.state != unlambda.runtime.STATE.RUNNING) {
    ctx.current_variable = new unlambda.Variable(cur.op, v1, v2);
    return;
  }
  if (ctx.step == ctx.step_limit) {
    ctx.current_variable = new unlambda.Variable(cur.op, v1, v2);
    ctx.state = unlambda.runtime.STATE.STEP_LIMIT;
    ctx.next_apply = ctx.current_variable;
    return;
  }
  ctx.step++;
  var applyFunc = this.FUNC_TABLE[v1.op];
  applyFunc.call(this, ctx, v1, v2);
};

unlambda.runtime.applyI = function(ctx, f, x) {
  ctx.current_variable = x;
};
unlambda.runtime.applyV = function(ctx, f, x) {
  ctx.current_variable = f;
};
unlambda.runtime.applyK = function(ctx, f, x) {
  ctx.current_variable = new unlambda.Variable(unlambda.OP.K1, x, null);
};
unlambda.runtime.applyK1 = function(ctx, f, x) {
  ctx.current_variable = f.v1;
};
unlambda.runtime.applyS = function(ctx, f, x) {
  ctx.current_variable = new unlambda.Variable(unlambda.OP.S1, x, null);
};
unlambda.runtime.applyS1 = function(ctx, f, x) {
  ctx.current_variable = new unlambda.Variable(unlambda.OP.S2, f.v1, x);
};
unlambda.runtime.applyS2 = function(ctx, f, x) {
  ctx.current_variable = new unlambda.Variable(
    unlambda.OP.APPLY,
    new unlambda.Variable(unlambda.OP.APPLY, f.v1, x),
    new unlambda.Variable(unlambda.OP.APPLY, f.v2, x));
  this.eval_(ctx);
};
unlambda.runtime.applyC = function(ctx, f, x) {
  var varC1 = new unlambda.Variable(unlambda.OP.C1, null, null);
  ctx.state = unlambda.runtime.STATE.C_BREAK;
  ctx.event_c1 = varC1;
  ctx.current_variable = new unlambda.Variable(unlambda.OP.APPLY, x, varC1);
};
unlambda.runtime.applyC1 = function(ctx, f, x) {
  ctx.state = unlambda.runtime.STATE.C1_BREAK;
  ctx.event_c1 = f;
  ctx.c1_result = x;
};
unlambda.runtime.applyD = function(ctx, f, x) {
  ctx.current_variable = new unlambda.Variable(unlambda.OP.D1, x, null);
};
unlambda.runtime.applyD1 = function(ctx, f, x) {
  ctx.current_variable = new unlambda.Variable(unlambda.OP.APPLY, f.v1, x);
  this.eval_(ctx);
};
unlambda.runtime.applyPrint = function(ctx, f, x) {
  ctx.io.output(f.v1);
  ctx.current_variable = x;
};
unlambda.runtime.applyRead = function(ctx, f, x) {
  var s = ctx.io.input();
  if (s == unlambda.runtime.IO_CODE.BLOCK) {
    ctx.step--;
    ctx.current_variable = new unlambda.Variable(unlambda.OP.APPLY, f, x);
    ctx.state = unlambda.runtime.STATE.INPUT_WAIT;
    ctx.next_apply = ctx.current_variable;
  } else if (s == unlambda.runtime.IO_CODE.EOF) {
    ctx.current_character = s;
    ctx.current_variable = new unlambda.Variable(
      unlambda.OP.APPLY, x, new unlambda.Variable(unlambda.OP.V, null, null));
    this.eval_(ctx);
  } else {
    ctx.current_character = s;
    ctx.current_variable = new unlambda.Variable(
      unlambda.OP.APPLY, x, new unlambda.Variable(unlambda.OP.I, null, null));
    this.eval_(ctx);
  }
};
unlambda.runtime.applyExit = function(ctx, f, x) {
  ctx.state = unlambda.runtime.STATE.EXITED;
  ctx.exit_arg = x;
  ctx.current_variable = new unlambda.Variable(unlambda.OP.V, null, null);
};
unlambda.runtime.applyReprint = function(ctx, f, x) {
  var varArg;
  if (ctx.current_character == unlambda.runtime.IO_CODE.EOF) {
    varArg = new unlambda.Variable(unlambda.OP.V, null, null);
  } else {
    varArg = new unlambda.Variable(
      unlambda.OP.PRINT, ctx.current_character, null);
  }
  ctx.current_variable = new unlambda.Variable(unlambda.OP.APPLY, x, varArg);
  this.eval_(ctx);
};
unlambda.runtime.applyCompare = function(ctx, f, x) {
  var varArg;
  if (ctx.current_character == f.v1) {
    varArg = new unlambda.Variable(unlambda.OP.I, null, null);
  } else {
    varArg = new unlambda.Variable(unlambda.OP.V, null, null);
  }
  ctx.current_variable = new unlambda.Variable(unlambda.OP.APPLY, x, varArg);
  this.eval_(ctx);
};

unlambda.runtime.FUNC_TABLE = {};
unlambda.runtime.FUNC_TABLE[unlambda.OP.I] = unlambda.runtime.applyI;
unlambda.runtime.FUNC_TABLE[unlambda.OP.V] = unlambda.runtime.applyV;
unlambda.runtime.FUNC_TABLE[unlambda.OP.K] = unlambda.runtime.applyK;
unlambda.runtime.FUNC_TABLE[unlambda.OP.K1] = unlambda.runtime.applyK1;
unlambda.runtime.FUNC_TABLE[unlambda.OP.S] = unlambda.runtime.applyS;
unlambda.runtime.FUNC_TABLE[unlambda.OP.S1] = unlambda.runtime.applyS1;
unlambda.runtime.FUNC_TABLE[unlambda.OP.S2] = unlambda.runtime.applyS2;
unlambda.runtime.FUNC_TABLE[unlambda.OP.C] = unlambda.runtime.applyC;
unlambda.runtime.FUNC_TABLE[unlambda.OP.C1] = unlambda.runtime.applyC1;
unlambda.runtime.FUNC_TABLE[unlambda.OP.D] = unlambda.runtime.applyD;
unlambda.runtime.FUNC_TABLE[unlambda.OP.D1] = unlambda.runtime.applyD1;
unlambda.runtime.FUNC_TABLE[unlambda.OP.PRINT] = unlambda.runtime.applyPrint;
unlambda.runtime.FUNC_TABLE[unlambda.OP.READ] = unlambda.runtime.applyRead;
unlambda.runtime.FUNC_TABLE[unlambda.OP.E] = unlambda.runtime.applyExit;
unlambda.runtime.FUNC_TABLE[unlambda.OP.REPRINT] = unlambda.runtime.applyReprint;
unlambda.runtime.FUNC_TABLE[unlambda.OP.COMPARE] = unlambda.runtime.applyCompare;


var page = page || {};

// unlambda_app.App
// util.DomHelper
page.InputPanel = function(app, dom_helper) {
  this.app = app;
  this.dom_helper = dom_helper;
  // DOMs.
  this.input_area = null;
  this.input_eof_checkbox = null;
  this.input_wait_checkbox = null;
  this.echo_back_checkbox = null;
  // If input is empty, return EOF when eof_mode is true.
  // Otherwise, wait for input .
  this.eof_mode = false;
};

page.InputPanel.prototype.init = function() {
  this.input_area = this.dom_helper.get('input');
  this.input_eof_checkbox = this.dom_helper.get('input_eof');
  this.input_wait_checkbox = this.dom_helper.get('input_wait');
  this.echo_back_checkbox = this.dom_helper.get('echo_back');
  this.dom_helper.addEventListener(
    this.input_area, 'change', this, this.onChange);
  this.dom_helper.addEventListener(
    this.input_area, 'keyup', this, this.onChange);
  this.dom_helper.addEventListener(
    this.input_eof_checkbox, 'change', this, this.onChange);
  this.dom_helper.addEventListener(
    this.input_wait_checkbox, 'change', this, this.onChange);

  // grab initial value.
  this.onChange();
};

page.InputPanel.prototype.onChange = function() {
  if (this.dom_helper.isChecked(this.input_eof_checkbox)) {
    this.eof_mode = true;
  } else if (this.dom_helper.isChecked(this.input_wait_checkbox)) {
    this.eof_mode = false;
  }
  this.app.getController().onInputChange();
};

page.InputPanel.prototype.getEchoBackMode = function() {
  return this.dom_helper.isChecked(this.echo_back_checkbox);
};

// This method implements inputCallback on unlambda.runtime.IO.
page.InputPanel.prototype.consumeCharacter = function() {
  var str = this.dom_helper.getValue(this.input_area);
  if (str.length == 0) {
    if (this.eof_mode) {
      return unlambda.runtime.IO_CODE.EOF;
    } else {
      return unlambda.runtime.IO_CODE.BLOCK;
    }
  } else {
    var result = str.substring(0, 1);
    str = str.substring(1);
    this.dom_helper.setValue(this.input_area, str);
    return result;
  }
};


var unlambda = unlambda || {};

unlambda.Unlambda = function() {
};

unlambda.Unlambda.prototype.parse = function(code) {
  return unlambda.parser.parse(code);
};
unlambda.Unlambda.prototype.newContext = function(
  variable, inputCallback, outputCallback) {
  return new unlambda.runtime.RuntimeContext(
    variable, new unlambda.runtime.IO(inputCallback, outputCallback));
}
unlambda.Unlambda.prototype.run = function(ctx) {
  return unlambda.runtime.run(ctx);
};

var unlambda_app = unlambda_app || {};

unlambda_app.AppContext = function() {
  this.run_state = unlambda_app.RUN_STATE.STOPPED;
  this.run_mode = null;
  this.step_limit = -1;
  this.runtime_context = null; // unlambda.runtime.RuntimeContext
};

unlambda_app.AppContext.prototype.getCurrentStep = function() {
  if (this.run_state == unlambda_app.RUN_STATE.STOPPED) {
    return 0;
  }
  return this.runtime_context.step;
};
var unlambda_app = unlambda_app || {};

// unlambda_app.App, unlambda.Unlambda, util.LoopThreadFactory
unlambda_app.Controller = function(app, unl, loop_thread_factory) {
  this.app = app;
  this.unl = unl;
  this.loop_thread_factory = loop_thread_factory;
  this.run_thread = null;
  this.input_callback = null;
  this.output_callback = null;
};

unlambda_app.Controller.MAX_BURST_STEP = 5000;

unlambda_app.Controller.prototype.init = function() {
  var that = this;
  this.run_thread = this.loop_thread_factory.create(
    function() {return that.run_()});
  this.input_callback = function() {return that.onUnlambdaInput();};
  this.output_callback = function(c) {that.onUnlambdaOutput(c);};
};

unlambda_app.Controller.prototype.run_ = function() {
  var ctx = this.app.getAppContext();
  if (ctx.run_state != unlambda_app.RUN_STATE.RUNNING) {
    return false;
  }
  this.setUpRuntimeStepLimit(ctx);
  this.unl.run(ctx.runtime_context);
  switch (ctx.runtime_context.state) {
  case unlambda.runtime.STATE.EXITED:
    ctx.run_state = unlambda_app.RUN_STATE.STOPPED;
    this.updateView();
    return false;
  case unlambda.runtime.STATE.INPUT_WAIT:
    ctx.run_state = unlambda_app.RUN_STATE.INPUT_WAIT;
    this.updateView();
    return false;
  case unlambda.runtime.STATE.STEP_LIMIT:
    if (ctx.getCurrentStep() == ctx.step_limit) {
      ctx.run_state = unlambda_app.RUN_STATE.PAUSED;
      this.updateView();
      return false;
    } else {
      this.updateView();
      return true;
    }
  default:
    throw 'unexpected runtime result!';
  }
};

unlambda_app.Controller.prototype.setUpRuntimeStepLimit = function(ctx) {
  var cur_step = ctx.getCurrentStep();
  if (ctx.run_mode == unlambda_app.RUN_MODE.RUN_STEP) {
    if (cur_step == ctx.step_limit) {
      ctx.runtime_context.step_limit = cur_step;
    } else {
      ctx.runtime_context.step_limit = cur_step + 1;
    }
  } else {
    if (ctx.step_limit == -1) {
      ctx.runtime_context.step_limit =
        cur_step + unlambda_app.Controller.MAX_BURST_STEP;
    } else {
      ctx.runtime_context.step_limit = Math.min(
        ctx.step_limit, cur_step + unlambda_app.Controller.MAX_BURST_STEP);
    }
  }
};

unlambda_app.Controller.prototype.stop = function() {
  var ctx = this.app.getAppContext();
  this.fillNextApplyIfRunning();
  ctx.run_state = unlambda_app.RUN_STATE.STOPPED;
  this.updateView();
};

unlambda_app.Controller.prototype.pause = function() {
  var ctx = this.app.getAppContext();
  if (ctx.run_state == unlambda_app.RUN_STATE.STOPPED) {
    return;
  }
  this.fillNextApplyIfRunning();
  ctx.run_state = unlambda_app.RUN_STATE.PAUSED;
  this.updateView();
};

unlambda_app.Controller.prototype.fillNextApplyIfRunning = function() {
  var ctx = this.app.getAppContext();
  if (ctx.run_state != unlambda_app.RUN_STATE.RUNNING)
    return;
  var rctx = ctx.runtime_context;
  var original_step_limit = rctx.step_limit;

  rctx.step_limit = rctx.step;
  this.unl.run(rctx);
  rctx.step_limit = original_step_limit;
};

// unlambda_app.RUN_MODE, int
// -1 for limit to indicate run infinately.
unlambda_app.Controller.prototype.run = function(mode, limit) {
  var ctx = this.app.getAppContext();
  var ok = true;
  if (ctx.run_state == unlambda_app.RUN_STATE.STOPPED) {
    this.app.getOutputPanel().clear();
    this.app.getStatusPanel().clear();
    var code = this.app.getInputCodePanel().getCode();
    var parse_result = this.unl.parse(code);
    if (!parse_result.success) {
      this.app.getStatusPanel().setCompileError(
        code, parse_result.error, parse_result.error_pos);
      ok = false;
    } else {
      ctx.runtime_context = this.unl.newContext(
        parse_result.variable, this.input_callback, this.output_callback);
    }
  }
  if (ok) {
    ctx.run_state = unlambda_app.RUN_STATE.RUNNING;
    ctx.run_mode = mode;
    ctx.step_limit = limit;
    this.run_thread.run();
  }
  this.updateView();
};

unlambda_app.Controller.prototype.setThreadWaitInterval = function(t) {
  this.run_thread.setInterval(t);
};

unlambda_app.Controller.prototype.onInputChange = function() {
  var ctx = this.app.getAppContext();
  if (ctx.run_state == unlambda_app.RUN_STATE.INPUT_WAIT) {
    ctx.run_state = unlambda_app.RUN_STATE.RUNNING;
    this.run_thread.run();
  }
};

unlambda_app.Controller.prototype.onUnlambdaInput = function() {
  var c = this.app.getInputPanel().consumeCharacter();
  if (this.app.getInputPanel().getEchoBackMode() &&
      c != unlambda.runtime.IO_CODE.EOF &&
      c != unlambda.runtime.IO_CODE.BLOCK) {
    this.app.getOutputPanel().appendInputEchoBack(c);
  }
  return c;
};

unlambda_app.Controller.prototype.onUnlambdaOutput = function(c) {
  this.app.getOutputPanel().appendOutput(c);
};

unlambda_app.Controller.prototype.updateView = function() {
  this.app.getControlPanel().updateView();
  this.app.getCurrentCodePanel().updateView();
  this.app.getInputCodePanel().updateView();
  this.app.getStatusPanel().updateView();
};

var page = page || {};

// unlambda_app.App, util.DomHelper
page.CurrentCodePanel = function(app, dom_helper) {
  this.app = app;
  this.dom_helper = dom_helper;

  this.show_mode = false;
  // dom
  this.show_current_variable_checkbox = null;
  this.current_variable_container = null;
  this.current_variable_block = null;
};

page.CurrentCodePanel.prototype.init = function() {
  this.show_current_variable_checkbox =
    this.dom_helper.get('show_current_variable');
  this.current_variable_container =
    this.dom_helper.get('current_variable_container');
  this.current_variable_block = this.dom_helper.get('current_variable_block');
  this.dom_helper.addEventListener(
    this.show_current_variable_checkbox, 'change', this, this.onCheckBoxChange);
  // initial value sestting.
  this.onCheckBoxChange({});
};

page.CurrentCodePanel.prototype.onCheckBoxChange = function(ev) {
  this.show_mode =
    this.dom_helper.isChecked(this.show_current_variable_checkbox);
  this.updateView();
};

page.CurrentCodePanel.prototype.updateView = function() {
  var ctx = this.app.getAppContext();
  this.dom_helper.removeChildren(this.current_variable_block);
  this.dom_helper.setDisplay(this.current_variable_container,
                             (this.show_mode ? "": "none"));
  if (this.show_mode && ctx.runtime_context &&
      ctx.runtime_context.variable) {
    var limitter = {allowed_depth: 500, allowed_nodes: 2000};
    this.createDomDfs_(
      this.current_variable_block, null,
      ctx.runtime_context.variable,
      ctx.runtime_context.next_apply, false, limitter);
  }
};

page.CurrentCodePanel.prototype.createDomDfs_ = function(
  parent, text, variable, next_apply, is_apply_arg, limitter) {
  if (limitter.allowed_depth <= 0 ||
      limitter.allowed_nodes <= 0) {
    var span = this.dom_helper.createElement('span');
    this.dom_helper.appendChild(parent, span);
    text = this.dom_helper.createTextNode();
    this.dom_helper.appendChild(span, text);
    this.dom_helper.appendData(text, '<...>');
    return;
  }
  limitter.allowed_nodes--;
  var is_apply = (variable.op == unlambda.OP.APPLY);
  if (is_apply || is_apply_arg) {
    var span = this.dom_helper.createElement('span');
    this.dom_helper.appendChild(parent, span);
    if (variable == next_apply) {
      this.dom_helper.addClass(span, 'next_apply');
    }
    parent = span;
    text = null;
  }
  if (text == null) {
    text = this.dom_helper.createTextNode();
    this.dom_helper.appendChild(parent, text);
  }
  if (variable.op == unlambda.OP.C1) {
    this.dom_helper.appendData(text, '<cont>');
    return;
  } else {
    if (variable.op == unlambda.OP.PRINT ||
        variable.op == unlambda.OP.COMPARE) {
      this.dom_helper.appendData(text, variable.op + variable.v1);
      return;
    } else {
      this.dom_helper.appendData(text, variable.op);
    }
  }
  if (variable.v1 != null) {
    limitter.allowed_depth--;
    this.createDomDfs_(
      parent, text, variable.v1, next_apply, is_apply, limitter);
    limitter.allowed_depth++;
  }
  if (variable.v2 != null) {
    limitter.allowed_depth--;
    this.createDomDfs_(
      parent, text, variable.v2, next_apply, is_apply, limitter);
    limitter.allowed_depth++;
  }
};

var unlambda_app = unlambda_app || {};

// function(unlambda_app.App): unlambda_app.Controller
// unlambda_app.AppContext
// array of function(unlambda_app.App): page.*Panel
unlambda_app.App = function(controller_factory, app_context, panel_factory) {
  this.controller = controller_factory(this);
  this.app_context = app_context;
  this.control_panel = panel_factory['control'](this);
  this.current_code_panel = panel_factory['current_code'](this);
  this.input_code_panel = panel_factory['input_code'](this);
  this.input_panel = panel_factory['input'](this);
  this.output_panel = panel_factory['output'](this);
  this.status_panel = panel_factory['status'](this);
};

// Window, Document
unlambda_app.App.create = function(window, doc){
  var unl = new unlambda.Unlambda();
  var loop_thread_factory = new util.LoopThreadFactory(window);
  var controller_factory = function(app) {
    return new unlambda_app.Controller(app, unl, loop_thread_factory);
  };
  var dom_helper = new util.DomHelper(doc);
  var js_loader = new util.JsLoader(dom_helper);
  var app_context = new unlambda_app.AppContext();
  var panel_factory = {
    'control': function(app) {
      return new page.ControlPanel(app, dom_helper);},
    'current_code': function(app) {
      return new page.CurrentCodePanel(app, dom_helper);},
    'input_code': function(app) {
      return new page.InputCodePanel(app, dom_helper, js_loader);},
    'input': function(app) {
      return new page.InputPanel(app, dom_helper);},
    'output': function(app) {
      return new page.OutputPanel(app, dom_helper);},
    'status': function(app) {
      return new page.StatusPanel(app, dom_helper);},
  };
  return new unlambda_app.App(controller_factory, app_context, panel_factory);
}

unlambda_app.App.prototype.init = function() {
  this.controller.init();
  this.control_panel.init();
  this.current_code_panel.init();
  this.input_code_panel.init();
  this.input_panel.init();
  this.output_panel.init();
  this.status_panel.init();
  this.controller.updateView();
};

unlambda_app.App.prototype.getController = function() {
  return this.controller;
};

unlambda_app.App.prototype.getAppContext = function() {
  return this.app_context;
};

unlambda_app.App.prototype.getControlPanel = function() {
  return this.control_panel;
};

unlambda_app.App.prototype.getCurrentCodePanel = function() {
  return this.current_code_panel;
};

unlambda_app.App.prototype.getInputCodePanel = function() {
  return this.input_code_panel;
};

unlambda_app.App.prototype.getInputPanel = function() {
  return this.input_panel;
};

unlambda_app.App.prototype.getOutputPanel = function() {
  return this.output_panel;
};

unlambda_app.App.prototype.getStatusPanel = function() {
  return this.status_panel;
};

window.onload = function() {
  var app = unlambda_app.App.create(window, document);
  app.init();
  // that's global variable!
  the_app = app;
};
