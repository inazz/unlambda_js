#!/usr/bin/ruby

require 'find'
require 'optparse'
require File.dirname(__FILE__) + '/source_files.rb'

class Builder

  def main(args)
    parseArgs(args)
    moveToRepositoryRoot()
    testResult = runTests()
    if !@build
      puts "Don't build js file since you specified so."
    elsif @test_filter != nil
      puts "Don't build js file since not all tests are executed."
    else
      if !testResult && !@force
        puts "Don't build js file since test didn't pass."
      else
        build()
        puts 'Build sucessfully finished.'
      end
    end
  end

  def parseArgs(args)
    opt = OptionParser.new

    @test_filter = nil
    opt.on('--test TEST_FILE', String, /.+/,
           'regexp to match test file name.') {|f|
      @test_filter = f}

    @build = true
    opt.on('--[no-]build', TrueClass) {|f| @build = f}
    @force = false
    opt.on('-f', TrueClass) {|f| @force = f}

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

  def build()
    buildTarget = 'entry.js'
    outputFile = 'html/unlambda.js'
    sourceFiles = SourceFiles.new
    files = sourceFiles.getOrderedFileList([buildTarget])
    files = ['header.js'] + files
    File.open(outputFile, 'w') { |fo|
      files.map!{|f| 'sources/' + f}.each{|file|
        File.open(file) {|fi|
          fi.each{|line|
            fo.write(line)
          }
        }
      }
    }
  end
end

Builder.new.main(ARGV)
