var fs = require('fs');
var path = require('path');
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
 * Load a dict object from a .plist file.
 * @param {*} args 
 * @param {*} dict 
 */
function loadValueFromDict(searchedkey, dict) {
    var nodes = dict.nodes;
    for(var i = 0;i < nodes.length;i+=2)  {
        var child = nodes[i];
        if(typeof(child) !== "string" && child.name === "key") {
            var key = child.getText();
            var value = nodes[i+1];
            if(key == searchedkey) {
                return value.getText();
            }
        }
    }
}

class Manifest{
    constructor(){
        this._xml = null;
        this._dir = ".";
    }

    // #region Properties

    get version(){ 
        var v = this.getXmlMetadata("CFBundleShortVersionString"); 
        v += "." + this.getXmlMetadata("CFBundleVersion"); 
        return parseVersion(v); 
    }
    set version(v){ 
        var version = parseVersion(v); 
        this.updateXmlMetadata({
            CFBundleShortVersionString: version.major + "." + version.minor + "." + version.patch,
            CFBundleVersion: version.build + ""
        });
    }
    
    get bundleIdentifier() { return this.getXmlMetadata("CFBundleIdentifier"); }
    set bundleIdentifier(v) { this.updateXmlMetadata({ CFBundleIdentifier: v }); }

    get displayName() { return this.getXmlMetadata("CFBundleName"); }
    set displayName(v) { this.updateXmlMetadata({ CFBundleName: v, CFBundleDisplayName: v }); }

    get icons(){ 
        var iconset = this.getXmlMetadata("XSAppIconAssets");
        var dir = path.join(this._dir,iconset);
        var files = fs.readdirSync(dir);
        return files.filter(function(f) { return path.extname(f) === ".png"; });
    }
    
    // #region XML

    updateXmlMetadata(values){
        var dict = this._xml.firstChild("dict");
        updateDict(values, dict);
    }

    getXmlMetadata(key){
        var dict = this._xml.firstChild("dict");
        return loadValueFromDict(key, dict);
    }

    // # region Loading

    load(args, cb) {
        var manifest = "Info.plist";
        if(args.file){
            manifest = args.file;
            this._dir = path.dirname(manifest);
        }

        var manifestContent = args.content || fs.readFileSync(manifest, 'utf8');
        var _this = this;

        // From XML
        XML.deserialize(manifestContent, function(err, plist) {
            if (err) return cb(err); 
            _this._xml = plist;
            cb(null,_this);
        });
    }

    save(args, cb) {
        var output = args.file;
        var _this = this;
        this._xml.serialize(function(err,xml){
            if (err) return cb(err); 
            try {
                fs.writeFileSync(output, xml, 'utf8');
                cb(null,_this);
            } catch (error) {
                cb(err);
            }
        }) 
    }
}

module.exports = Manifest;