/*jslint for:true */
var spacing = "  ";

function getType(obj) {
    "use strict";
    var type = typeof obj;
    if (Array.isArray(obj)) {
        return "array";
    } else if (type === "string") {
        return "string";
    } else if (type === "boolean") {
        return "boolean";
    } else if (type === "number") {
        return "number";
    } else if (type === "undefined" || obj === null) {
        return "null";
    } else {
        return "hash";
    }
}

function normalizeString(str) {
    "use strict";
    if (str.match(/^[\w]+$/)) {
        return str;
    } else {
        return "\"" + decodeURI(str).replace(/%u/g, "\\u").replace(/%U/g, "\\U").replace(/%/g, "\\x") + "\"";
    }
}

function convertString(obj, ret) {
    "use strict";
    ret.push(normalizeString(obj));
}

function convertArray(obj, ret) {
    "use strict";
    var i;
    var j;
    var ele;
    var recurse;
    for (i = 0; i < obj.length; i += 1) {
        ele = obj[i];
        recurse = [];
        convert(ele, recurse);
        for (j = 0; j < recurse.length; j += 1) {
            if (j === 0) {
                ret.push("- " + recurse[j]);
            } else {
                ret.push(spacing + recurse[j]);
            }
        }
    }
}

function convertHash(obj, ret) {
    "use strict";
    var k;
    var i;
    var recurse;
    var ele;
    var type;
    for (k = 0; k < obj.length; k += 1) {
        recurse = [];
        if (obj.hasOwnProperty(k)) {
            ele = obj[k];
            convert(ele, recurse);
            type = getType(ele);
            if (type === "string" ||
                    type === "null" ||
                    type === "number" ||
                    type === "boolean") {
                ret.push(normalizeString(k) + ": " + recurse[0]);
            } else {
                ret.push(normalizeString(k) + ": ");
                for (i = 0; i < recurse.length; i += 1) {
                    ret.push(spacing + recurse[i]);
                }
            }
        }
    }
}

function convert(obj, ret) {
    "use strict";
    var type = getType(obj);

    switch (type) {
    case "array":
        convertArray(obj, ret);
        break;
    case "hash":
        convertHash(obj, ret);
        break;
    case "string":
        convertString(obj, ret);
        break;
    case "null":
        ret.push("null");
        break;
    case "number":
        ret.push(obj.toString());
        break;
    case "boolean":
        if (obj) {
            ret.push("true");
        } else {
            ret.push("false");
        }
        break;
    }
}

var json2yaml = function (obj) {
    "use strict";
    if (getType(obj) === "string") {
        obj = JSON.parse(obj);
    }

    var ret = [];
    convert(obj, ret);
    return ret.join("\n");
};
