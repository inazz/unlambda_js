unlambda_js
===========

Unlambda interpreter implemented by javascript.
Now available on [inazz.jp][inazz_jp_unlambda]!
 [inazz_jp_unlambda]: http://inazz.jp/unlambda/

Code is tested by google-js-test.
To install google-js-test, read and run scripts/install_gjstest.rb

<pre>
html/
  html, css and compiled .js files.
sources/
  Javascript sources to build "html/unlambda.js".
  Tests are under "sources/tests/" directory.
scripts/
  builder.rb
    Run test and build "html/unlambda.js"
  create_advent_loader.rb
    A script to create "html/adventure_loader.js".
    It download adventure unlambda code from irori's github repository and wrap it as javascript source.
  install_gjstest.rb
    Download and install google-js-test and packages used by google-js-test.
    Root permission required.
  source_files.rb
    describe dependency between files under "sources/" directory.
    This file is a library used by "builder.rb". not for execution.
</pre>
