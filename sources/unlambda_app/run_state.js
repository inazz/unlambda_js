
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