# Mongoose IP Addresses
## Store IP addresses in your [Mongoose][] models

## Install
```
npm install --save mongoose-ip-address
```

## Usage

```javascript

// some-model.js

var mongoose = require("mongoose");
var ipAddressPlugin = require("mongoose-ip-address");

var SomeSchema = new Schema({
  ...
});
SomeSchema.plugin(ipAddressPlugin, {fields: ["ip_address", "another_ip_address"]});
var SomeModel = db.model("SomeModel", SomeSchema);

module.exports = SomeModel

```

```javascript

// Using your model

var mongoose = require("mongoose");
var SomeModel = require("./models/some-model.js");

mongoose.connect("mongodb://localhost/cool-db");

someModelInstance = SomeModel.new({
  ip_address: "192.168.1.2" // string, can be IPv4 or IPv6
  ...
})

// Alternately, use =
someModelInstance.ip_address = "FE80:0000:0000:0000:0202:B3FF:FE1E:8329"; // string, can be IPv4 or IPv6

someModelInstance.save()

console.log(someModelInstance.ip_address); // String
console.log(someModelInstance._ip_address_buf); // Buffer


```

This will add the fields you specify in the `fields` argument as virtuals to your schema. It will actually store the IP address as a `Buffer` in MongoDB, but it will allow you to get and set these fields as strings.

There are many advantages to this. For example, it makes grabbing entries by a range of IP addresses much easier.

```javascript
var ip = require("ip");

var ip_range_start = ip.toBuffer("192.168.1.1")
var ip_range_end = ip.toBuffer("192.168.1.2")

SomeModel.find(
  {
    $and: [
      { "_ip_address_buf": { $lte: ip_range_end}},
      { "_ip_address_buf": { $gte: ip_range_start}}
    ]
  },
  function(err, docs) {
    if(err) return console.error(err);
    console.log(docs);
  }
);
```

## TODO
- Allow better integration if the fields are already part of the schema, or you want to set more options on them
- Validation
- Unit tests...


## Bugs and pull requests

Please use the github [repository][] to file bugs and make pull requests.

## License

This software is released under the MIT license. Use it, fork it.

[Mongoose]: http://mongoosejs.com
[repository]: http://github.com/keenahn/mongoose-ip-address
