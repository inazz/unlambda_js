

var unlambda = unlambda || {};
unlambda.parser = unlambda.parser || {};

unlambda.parser.Result = function() {
};

unlambda.parser.ERROR = {
  SUCCESS: 0,
  UNKNOWN_CHARACTER: 1,
  UNEXPECTED_EOF: 2,
};


// code -- string
// rturn unlambda.parser.Result
unlambda.parser.parse = function(code) {
	var len = code.length;
  // TODO(inazz): implement here.
};


// return first non-comment charactor position after 'start' in 'code'.
// code -- string
// start -- int
// return -- int
unlambda.parser.findEndOfComment = function(code, start) {
  var len = code.length;
  var cur = start;
  while (cur != len) {
    var c = code.charAt(cur);
    if (" \t\r\n".indexOf(c) != -1) {
      cur++;
    } else if (c == "#") {
      cur = code.indexOf("\n", cur+1);
      if (cur == -1) {
        cur = len;
      }
    } else {
      break; 
    }
  }
  return cur;
}
