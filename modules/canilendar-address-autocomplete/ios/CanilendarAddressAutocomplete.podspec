require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name = 'CanilendarAddressAutocomplete'
  s.version = package['version']
  s.summary = 'Native iOS address autocomplete for Canilendar'
  s.description = 'MapKit-based address autocomplete module used by Canilendar.'
  s.homepage = 'https://github.com/aweigl/Canilendar'
  s.license = { type: 'MIT' }
  s.author = { 'Aaron Weigl' => 'info@aaron-weigl.de' }
  s.platforms = {
    :ios => '15.1'
  }
  s.swift_version = '5.9'
  s.source = { git: 'https://example.invalid/canilendar-address-autocomplete.git', tag: s.version.to_s }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = '**/*.{h,m,swift}'
end
