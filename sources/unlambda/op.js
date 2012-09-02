
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
