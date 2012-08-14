

var page = page || {};

// unlambda_app.App
// util.DomHelper
page.StatusPanel = function(app, dom_helper) {
  this.app = app;
  this.dom_helper = dom_helper;
  this.status_block = null;
};

page.StatusPanel.prototype.init = function() {
  this.status_block = this.dom_helper.get('status_block');
};

page.StatusPanel.prototype.clear = function() {
  this.dom_helper.removeChildren(this.status_block);
};

// string, unlambda.parser.ERROR, int
page.StatusPanel.prototype.setCompileError = function(code, err, err_pos) {
  this.clear();
  this.addCompileErrorMessage_(err, err_pos);
  this.maybeAddCodeSnippet_(code, err, err_pos);
};

page.StatusPanel.prototype.addCompileErrorMessage_ = function(err, err_pos) {
  var span = this.dom_helper.createElement('span');
  this.dom_helper.appendChild(this.status_block, span);
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
  this.dom_helper.appendChild(this.status_block, code_node);
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
