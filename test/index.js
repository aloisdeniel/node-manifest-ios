var assert = require('assert');
var path = require('path');

var iOSManifest = require('..');

var ios = new iOSManifest();
ios.load({ file: path.join(__dirname, "Info.plist") }, function(err){
    ios.version = "2.5.6.7";
    ios.bundleIdentifier = "com.test.sample";
    ios.displayName = "Sample";
    console.log(ios.icons)
    ios.save({ file: path.join(__dirname, "Info.Updated.plist") }, function(err) {
        console.log("DONE");
    })
})