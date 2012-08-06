
class SourceFiles

  def getDependencyHash()
    return {
      # build target
      'entry.js' => ['unlambda/runtime.js',
        'unlambda_app/init.js', 'unlambda_app/app.js'],
      # unlambda core logics
      'unlambda/op.js' => [],
      'unlambda/parser.js' => ['unlambda/op.js', 'unlambda/variable.js'],
      'unlambda/runtime.js' => [
        'unlambda/op.js', 'unlambda/variable.js', 'unlambda/parser.js'],
      'unlambda/unlambda.js' => ['unlambda/parser.js', 'unlambda/runtime.js'],
      'unlambda/variable.js' => ['unlambda/op.js'],
      'unlambda/variable_gjstestequals.js' => ['unlambda/variable.js'],
      # app logics.
      'unlambda_app/app.js' => [
        'unlambda_app/app_context.js', 'unlambda_app/controller.js',
        'page/code_panel.js', 'page/control_panel.js',
        'page/input_panel.js', 'page/output_panel.js',
        'unlambda/unlambda.js'],
      'unlambda_app/app_context.js' => [
        'unlambda/runtime.js',
        'unlambda_app/run_mode.js', 'unlambda_app/run_state.js'],
      'unlambda_app/controller.js' => [
        'unlambda/unlambda.js', 'util/loop_thread_factory.js'],
      'unlambda_app/init.js' => ['unlambda_app/app.js'],
      'unlambda_app/mock_app.js' => ['unlambda_app/app.js'],
      'unlambda_app/run_mode.js' => [],
      'unlambda_app/run_state.js' => [],
      # page components.
      'page/code_panel.js' => ['util/dom_helper.js'],
      'page/control_panel.js' => ['util/dom_helper.js'],
      'page/input_panel.js' => ['util/dom_helper.js'],
      'page/output_panel.js' => ['util/dom_helper.js'],
      # utility.
      'util/dom_helper.js' => [],
      'util/loop_thread.js' => [],
      'util/loop_thread_factory.js' => ['util/loop_thread.js'],
      # unlambda tests
      'tests/unlambda/op_test.js' => ['unlambda/op.js'],
      'tests/unlambda/parser_test.js' => [
        'unlambda/variable_gjstestequals.js', 'unlambda/parser.js'],
      'tests/unlambda/runtime_test.js' => [
        'unlambda/runtime.js', 'unlambda/variable_gjstestequals.js'],
      'tests/unlambda/unlambda_test.js' => [
        'unlambda/unlambda.js', 'unlambda/variable_gjstestequals.js'],
      'tests/unlambda/variable_test.js' => [
        'unlambda/op.js', 'unlambda/variable.js'],
      'tests/unlambda/variable_gjstestequals_test.js' => [
        'unlambda/variable_gjstestequals.js'],
      # app logics tests.
      'tests/unlambda_app/app_test.js' => ['unlambda_app/app.js'],
      'tests/unlambda_app/app_context_test.js' => [
        'unlambda_app/app_context.js'],
      'tests/unlambda_app/controller_test.js' => [
        'unlambda_app/mock_app.js', 'unlambda_app/controller.js' ],
      # page component tests.
      'tests/page/control_panel_test.js' => ['unlambda_app/mock_app.js',
        'page/control_panel.js'],
      'tests/page/output_panel_test.js' => ['unlambda_app/mock_app.js',
        'page/output_panel.js'],
      # utility tests.
      'tests/util/dom_helper_test.js' => ['util/dom_helper.js'],
      'tests/util/loop_thread_test.js' => ['util/loop_thread.js'],
      'tests/util/loop_thread_factory_test.js' => [
        'util/loop_thread_factory.js'],
    }
  end
  private :getDependencyHash

  def getAllFiles()
    getDependencyHash().keys
  end

  def getOrderedFileList(buildTargets)
    nameToScore = {}
    depsHash = getDependencyHash()
    # scoring
    buildTargets.each{|file|
      scoreFileDfs(file, nameToScore, depsHash)
    }
    files = nameToScore.keys
    # sanitize
    files.each{|file|
      depsHash[file].each{|dep|
        if (nameToScore[file] <= nameToScore[dep])
          raise 'dependency broken. detected a loop including "' + file + '".'
        end
      }
    }
    # sort
    return files.sort_by{|f| nameToScore[f]}
  end

  def scoreFileDfs(file, nameToScore, depsHash)
    return nameToScore[file] if nameToScore.has_key?(file)
    raise 'missing dependency for "' + file + '".' if !depsHash.has_key?(file)
    deps = depsHash[file]
    score = (deps.map{|d| scoreFileDfs(d, nameToScore, depsHash)+1} + [0]).max
    return nameToScore[file] = score;
  end
  private :scoreFileDfs

end
