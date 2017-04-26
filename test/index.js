var assert = require('assert');
var path = require('path');

var ios = require('..');

var args = { 
    displayname: "Sample",
    version: "2.5.6.7",
    bundleidentifier: "com.test.sample",
    manifest: path.join(__dirname, "Info.plist"),
    output: path.join(__dirname, "Info.Updated.plist")
};

ios.update(args, function(err,xml) {
    console.log(xml)
});