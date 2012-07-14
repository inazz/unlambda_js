#!/usr/bin/ruby

require 'find'

class TestRunner

  def main
    moveToRepositoryRoot()
    runTests()
  end

  def moveToRepositoryRoot()
    criteria = ['sources/unlambda', 'sources/tests']
    10.times{
      return if criteria.all?{|f| File.exist?(f)}
      Dir.chdir('..')
    }
    throw "Failed to find repository root.\n" +
      "Please execute this script from directory in the repository.\n"
  end

  def runTests()
    sources = getJsFiles('sources/unlambda')
    tests = getJsFiles('sources/tests')
    system('gjstest', '--js_files=' + (sources + tests).join(','))
  end

  def getJsFiles(dir)
    files = []
    Find.find(dir) {|f|
      files.push(f) if f =~/\.js$/
    }
    return files
  end
end

TestRunner.new.main()
