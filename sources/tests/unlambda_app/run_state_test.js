
function UnlambdaAppRunStateTest() {
}
registerTestSuite(UnlambdaAppRunStateTest);

UnlambdaAppRunStateTest.prototype.ToString = function() {
  expectEq("STOPPED",
           unlambda_app.RUN_STATE.toString(unlambda_app.RUN_STATE.STOPPED));
  expectEq("PAUSED",
           unlambda_app.RUN_STATE.toString(unlambda_app.RUN_STATE.PAUSED));
  expectEq("RUNNING",
           unlambda_app.RUN_STATE.toString(unlambda_app.RUN_STATE.RUNNING));
  expectEq("INPUT_WAIT",
           unlambda_app.RUN_STATE.toString(unlambda_app.RUN_STATE.INPUT_WAIT));
};

