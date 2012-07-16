
var unlambda = unlambda || {};

unlambda.OP = {  // comments are expected Variable.v1 and v2.
  APPLY:   '`',  // not evluated variable, not evaluated variable
  S:       's',
  S1:      's1', // variable
  S2:      's2', // variable, variable
  K:       'k',
  K1:      'k1', // variable
  I:       'i',
  V:       'v',
  C:       'c',
  C1:      'c1', // root_variable, current_character
  D:       'd',
  D1:      'd1', // not evaluated variable
  PRINT:   '.',  // string of length 1
  E:       'e',
  READ:    '@',
  COMPARE: '?',  // string of length 1
  REPRINT: '|',
};
