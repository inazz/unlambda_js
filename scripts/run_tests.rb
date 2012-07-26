#!/usr/bin/ruby

require 'find'
require 'optparse'
require File.dirname(__FILE__) + '/source_files.rb'

class TestRunner

  def main(args)
    parseArgs(args)
    moveToRepositoryRoot()
    runTests()
  end

  def parseArgs(args)
    opt = OptionParser.new
    @test_filter = nil
    opt.on('--test TEST_FILE', String, /.+/,
           'regexp to match test file name.') {|f|
      @test_filter = f}
    opt.parse!(args)
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
    sourceFiles = SourceFiles.new
    testTargets = sourceFiles.getAllFiles().select{|f| f =~/\_test\.js$/}
    if (@test_filter != nil)
      testTargets.reject!{|f| !f.match(@test_filter)}
    end
    files = sourceFiles.getOrderedFileList(testTargets)
    files.map!{|f| 'sources/' + f}
    return system('gjstest', '--js_files=' + files.join(','))
  end
end

TestRunner.new.main(ARGV)
