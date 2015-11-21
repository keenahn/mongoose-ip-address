/*
 * A simple mongoose plugin for getting and setting ip addresses
 */
var ip, ipAddressPlugin;

ip = require("ip");

/*
@param {Schema} schema
@param {Object} options, must include "fields" which is an array of strings
@returns {Schema}
 */
ipAddressPlugin = function(schema, options) {
  var addVirtual, f, fields, fn, i, len, makeHiddenKey;

  fields = options.fields;

  makeHiddenKey = function(f) {
    return "_" + f + "_buf";
  };

  addVirtual = function(schema, f) {
    var key;
    key = makeHiddenKey(f);
    return schema.virtual(f).get(function() {
      try {
        return ip.toString(this[key]);
      } catch (err) {
        return null;
      }
    }).set(function(ipString) {
      try {
        return this.set(key, ip.toBuffer(ipString));
      } catch (err) {
        return this.set(key, null);
      }
    });
  };

  addIpAddressField = function(field) {
    var key, obj;
    obj = {};
    key = makeHiddenKey(field);
    obj[key] = {
      type: Buffer,
      required: false,
      select: false,
      index: true
    };
    schema.add(obj);
    return addVirtual(schema, field);
  };

  for (i = 0, len = fields.length; i < len; i++) {
    field = fields[i];
    addIpAddressField(field);
  }
  return schema;
};

module.exports = ipAddressPlugin;
