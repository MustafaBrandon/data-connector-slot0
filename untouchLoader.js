const fs = require("fs");
const AsBind = require("as-bind/dist/as-bind.cjs.js");
const imports = {
  console: {
    log: message => {
      console.log(asBindInstance.exports.__getString(message));
    }
  }
};
const asBindInstance = AsBind.instantiateSync(fs.readFileSync(__dirname + "/build/untouched.wasm"), imports)
module.exports = asBindInstance.exports;