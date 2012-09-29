unlambda_js
===========

unlambda interpreter implemented by javascript.

Javascript code is tested by google-js-test.
To install google-js-test, read and run scripts/install_gjstest.rb

html/
  html, css and compiled .js files.
sources/
  Javascript sources to build html/unlambda.js.
  Tests are under sources/tests/ directory.
scripts/
  various scripts..
  builder.rb
    Run test and build "html/unlambda.js"
  create_advent_loader.rb
    A script to create "html/adventure_loader.js". It download adventure unlambda code from irori's github repository and wrap it as javascript source.
  install_gjstest.rb
    Download and install google-js-test and packages used by google-js-test.
    Root permission required.
  source_files.rb
    describe dependency between files under "sources/" directory.
    This file is a library used by "builder.rb". not for execution.
