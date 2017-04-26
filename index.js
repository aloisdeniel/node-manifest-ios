var fs = require('fs');
var XML = require('xmlobject');
var parseVersion = require('parse-version');

var exports = module.exports = {};

/**
 * Update a dict object from a .plist file.
 * @param {*} args 
 * @param {*} dict 
 */
function updateDict(args, dict) {
    var nodes = dict.nodes;
    for(var i = 0;i < nodes.length;i+=2)  {
        var child = nodes[i];
        if(typeof(child) !== "string" && child.name === "key") {
            var key = child.getText();
            var value = nodes[i+1];
            var newValue = args[key]
            if(newValue) {
                 value.setText(newValue);
            }
        }
    }
}

/**
 * Update the manifest of an iOS application.
 */
exports.update = function(args, cb) {

    // Arguments
    var versionString =  args.version || "1.0.0.0";
    var displayname = args.displayname;
    var bundleidentifier = args.bundleidentifier;
    var isprerelease = args.prerelease || false;
    var manifest = args.manifest || "Info.plist";
    var manifestContent = args.manifestContent || fs.readFileSync(manifest, 'utf8');
    var output = args.output;

    // Parsing
    parseVersion(versionString, function(err, version) {
        if (err) return cb(err); 

        // From XML
        XML.deserialize(manifestContent, function(err, plist) {
            if (err) return cb(err); 

            // Update metadata
            var dict = plist.firstChild("dict");
            updateDict({
                CFBundleName: displayname,
                CFBundleIdentifier: bundleidentifier,
                CFBundleShortVersionString: version.major + "." + version.minor + "." + version.patch,
                CFBundleVersion: version.build + ""
            }, dict);

            // To XML
            plist.serialize(function(err,xml){
                if (err) return cb(err); 
                var result = {
                    file: output,
                    xml: xml
                 }
                if(output) {
                    fs.writeFileSync(output, xml, 'utf8');
                }
                cb(null,result);
            })
        });
    });
}