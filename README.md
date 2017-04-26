# manifest-ios

Update your iOS mobile application manifest (version, bundle idenfifier, ...).

## Install

```sh
$ npm install --save manifest-ios
```

## Quickstart

```js
var path = require('path');
var ios = require('manifest-ios');

// From files

var args = { 
    displayname: "Sample",
    version: "2.5.6.7",
    bundleidentifier: "com.test.sample",
    manifest: path.join(__dirname, "Info.plist"),
    output: path.join(__dirname, "Info.Updated.plist")
};

ios.update(args, function(err,output) {
    console.log(output) // { xml: "...", file: "..." }
});

// From content

var args2 = { 
    displayname: "Sample",
    version: "2.5.6.7",
    bundleidentifier: "com.test.sample",
    manifestContent: "<...>"
};

ios.update(args2, function(err,xml) {
    console.log(output)  // { xml: "..."}
});

```

## Copyright and license

MIT © [Aloïs Deniel](http://aloisdeniel.github.io)