# manifest-ios

Update your iOS mobile application manifest (version, bundle idenfifier, ...).

## Install

```sh
$ npm install --save manifest-ios
```

## Quickstart

```js
var assert = require('assert');
var path = require('path');

var iOSManifest = require('..');

var ios = new iOSManifest();
ios.load({ file: path.join(__dirname, "Info.plist") }, function(err){
    ios.version = "2.5.6.7";
    ios.bundleIdentifier = "com.test.sample";
    ios.displayName = "Sample";
    ios.save({ file: path.join(__dirname, "Info.Updated.plist") }, function(err) {
        console.log("DONE");
    })
})
```

## Copyright and license

MIT © [Aloïs Deniel](http://aloisdeniel.github.io)