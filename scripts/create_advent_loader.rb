#!/usr/bin/ruby

target_file = File.dirname(__FILE__) + "/../html/adventure_loader.js"
target_function = "the_app.getInputCodePanel().onAdventureLoadComplete";
original_adventure_url = "https://raw.github.com/irori/advent-unlambda/master/advent.unl"

cmd = sprintf('wget -O - "%s"', original_adventure_url)

adventure_unl = `#{cmd}`
adventure_unl.gsub!(/\\/, "\\\\")
adventure_unl.gsub!(/\n/, "\\n")
adventure_unl.gsub!(/\"/, "\\\"")

source = sprintf("%s(\"%s\");\n", target_function, adventure_unl)

open(target_file, "w") {|f|
  f.write(source)
}
