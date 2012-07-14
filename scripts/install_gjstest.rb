#!/usr/bin/ruby
#
# This script will install gjstest and prerequisite package to build gjstest.
# Following packages are required to run this script:
#   wget tar aptitude make g++
# And this script will install:
#   libxml2 glog protobuf gflags mercurial re2 v8 gjstest
#

require 'fileutils'

class GjstestInstaller
  TMP_DIR_NAME = '__tmp_dir_for_gjstest'
  GFLAGS_VERSION = '2.0'
  GOOGLE_GLOG_VERSION = '0.3.2'
  GOOGLE_JS_TEST_VERSION = '1.0.7'
  
  def main
    FileUtils.mkpath(TMP_DIR_NAME)
    FileUtils.cd(TMP_DIR_NAME) {
      installLibxml2()
      installGlog()
      installProtobuf()
      installGflags()
      installMercurial()
      installRe2()
      installV8()
      installGjstest()
    }
    FileUtils.rm_r(TMP_DIR_NAME)
  end

  def installLibxml2
    aptitude('libxml2')
  end

  def installGlog
    archiveUrl = 'http://google-glog.googlecode.com/files/' +
      'glog-' + GOOGLE_GLOG_VERSION + '.tar.gz'
    install(archiveUrl, [['./configure'], ['make'], ['make', 'install']])
  end

  def installProtobuf
    aptitude('libprotobuf-dev')
  end

  def installGflags
    archiveUrl = 'http://gflags.googlecode.com/files/' +
      'gflags-' + GFLAGS_VERSION + '.tar.gz'
    install(archiveUrl, [['./configure'], ['make'], ['make', 'install']])
  end

  def installMercurial
    aptitude('mercurial')
  end

  def installRe2
    systemOrDie('hg', 'clone', 'https://re2.googlecode.com/hg', 're2')
    FileUtils.cd('re2') {
      systemOrDie('make', 'test')
      systemOrDie('make', 'install')
      systemOrDie('make', 'testinstall')
    }
  end

  def installV8
    aptitude('libv8-dev')
  end

  def installGjstest
    archiveUrl = 'http://google-js-test.googlecode.com/files/' +
      'gjstest-' + GOOGLE_JS_TEST_VERSION + '.tar.bz2'
    install(archiveUrl, [['make', 'install']])
  end

  def aptitude(pkg)
    systemOrDie('aptitude', 'install', pkg)
  end

  # download file from url, unarchive it, and exec commads to build/install it.
  def install(url, commands)
    raise "Invalid url: " + url if url !~/^https?:\/\/.+\/([^\/]+)$/
    filename = $1
    raise 'unknown suffix: ' + filename if filename !~/^(.+)\.tar\.(bz2|gz)$/
    dirname = $1
    archive = $2
    systemOrDie('wget', url)
    if archive == 'bz2'
      systemOrDie('tar', 'xjvf', filename)
    elsif archive == 'gz'
      systemOrDie('tar', 'xzvf', filename)
    else
      raise 'unexpected archive type: ' + archive
    end
    FileUtils.cd(dirname) {
      commands.each{|cmd|
        systemOrDie(*cmd)
      }
    }
  end
  
  # almost same to system, but raise error if it fail.
  def systemOrDie(*cmd)
    puts 'executes: ' + cmd.join(' ')
    ret = system(*cmd)
    raise "Failed to execute command: " + cmd.join(' ') if !ret
  end

end

GjstestInstaller.new.main()
