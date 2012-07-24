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
    files = SourceFiles.new.getFileList()
    if (@test_filter != nil)
      files.reject!{|f| f =~/\_test\.js$/ && !f.match(@test_filter)}
    end
    files.map!{|f| 'sources/' + f}
    return system('gjstest', '--js_files=' + files.join(','))
  end

end

TestRunner.new.main(ARGV)
