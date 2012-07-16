#!/usr/bin/ruby

require 'find'
require './source_files.rb'

class TestRunner

  def main(args)
    moveToRepositoryRoot()
    runTests(args)
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

  def runTests(args)
    files = SourceFiles.new.getFileList()
    if (args.length != 0)
      files.reject!{|f| f =~/\_test\.js$/ && !f.match(args[0])}
    end
    files.map!{|f| 'sources/' + f}
    system('gjstest', '--js_files=' + files.join(','))
  end
end

TestRunner.new.main(ARGV)
