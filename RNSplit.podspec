require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name = "RNSplit"
  s.module_name = "RNSplit"
  s.summary = package["description"]
  s.version = package["version"]
  s.author = package["author"]
  s.license = package["license"]
  s.homepage = package["homepage"]
  s.platforms = { :ios => "9.0", :tvos => "9.0", :osx => "10.11" }
  s.source = { :git => "https://github.com/splitio/react-native-client.git", :tag => "v#{s.version}" }
  s.source_files = "ios/**/*.{h,m}"
  s.dependency "React"
end
