const fs = require("fs");
import * as AsBind from "as-bind/dist/as-bind.cjs.js";


const imports = {
  // index: { // File which you are injecting
  //   stringToInt(arg0) {
  //     return parseInt(arg0)
  //   }
  // }
};

const asBindInstance = AsBind.instantiateSync(fs.readFileSync(__dirname + "/build/untouched.wasm"), imports)

module.exports = asBindInstance.exports;

