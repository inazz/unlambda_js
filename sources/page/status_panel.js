

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
