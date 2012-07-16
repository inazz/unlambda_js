
class SourceFiles

  def getDependencyHash()
    return {
      'unlambda/op.js' => [],
      'unlambda/parser.js' => ['unlambda/op.js', 'unlambda/variable.js'],
      'unlambda/runtime.js' => [
        'unlambda/op.js', 'unlambda/variable.js', 'unlambda/parser.js'],
      'unlambda/variable.js' => ['unlambda/op.js'],
      'unlambda/variable_gjstestequals.js' => ['unlambda/variable.js'],
      'tests/unlambda/op_test.js' => ['unlambda/op.js'],
      'tests/unlambda/parser_test.js' => [
        'unlambda/variable_gjstestequals.js', 'unlambda/parser.js'],
      'tests/unlambda/runtime_test.js' => [
        'unlambda/runtime.js', 'unlambda/variable_gjstestequals.js'],
      'tests/unlambda/variable_gjstestequals_test.js' => [
        'unlambda/variable_gjstestequals.js'],
    }
  end
  def getFileList()
    nameToScore = {}
    depsHash = getDependencyHash()
    # scoring
    depsHash.keys.each{|file|
      scoreFileDfs(file, nameToScore, depsHash)
    }
    # sanitize
    depsHash.each{|file, list|
      list.each{|dep|
        if (nameToScore[file] <= nameToScore[dep])
          raise 'dependency broken. detected a loop including "' + file + '".'
        end
      }
    }
    # sort
    return depsHash.keys.sort_by{|f| nameToScore[f]}
  end
  def scoreFileDfs(file, nameToScore, depsHash)
    return nameToScore[file] if nameToScore.has_key?(file)
    raise 'missing dependency for "' + file + '".' if !depsHash.has_key?(file)
    deps = depsHash[file]
    score = (deps.map{|d| scoreFileDfs(d, nameToScore, depsHash)+1} + [0]).max
    return nameToScore[file] = score;
  end
end
