import { config, input_config, output, response } from "./utils";
import fs from 'fs'
import {WasmModule, loadWasm} from "@steerprotocol/app-loader";

// We use untouched so that we can run the un-optimized version of the wasm which will provide better stacktraces
// const myModule = require("../untouchLoader");

function hexEncode(str: string): any {
  var hex, i;

  var result = "";
  for (i=0; i<str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += ("000"+hex).slice(-4);
  }

  return result
}

describe("WASM Transformation Module", () => {
  let myModule: WasmModule;

  // beforeEach(async () => {
  //   myModule = await loadWasm(fs.readFileSync(__dirname + "/../build/debug.wasm"), {})
  // });
  describe("Uniswap Data", () => {
    test("can return input config", async () => {
      myModule = await loadWasm(fs.readFileSync(__dirname + "/../build/debug.wasm"), {})
      // Call the configForm function on the transformation bundle
      const result = myModule.config();
      // Check that the result is the same as the expected result
      // Fix some funky encoding
      let hexResult = hexEncode(result) as string;
      hexResult = hexResult.replace(/000d/g, '');
      // hexResult = hexResult.replace(/0002/g, '');
      const hexExpected = hexEncode(input_config);
      // console.log('true')
  expect(hexResult).toEqual(hexExpected);
  });

    test("fails imporper config", async () => {
      myModule = await loadWasm(fs.readFileSync(__dirname + "/../build/debug.wasm"), {})
      const improperConfig = `{"config":"null"}`
      // let configMemoryRef = myModule.__pin(`{"config":"null"}`);
      const timestamp = 1654012158
      // The actual strategy instantiation and execution
      expect(() => {
        myModule.initialize(improperConfig);
      }).toThrowError();
    });

    test("can return call obj", async () => {
      myModule = await loadWasm(fs.readFileSync(__dirname + "/../build/debug.wasm"), {})
      const timestamp = 1654012158
      // const _config = myModule.__pin(myModule.__newString(config));
      myModule.initialize(config);
      const result = myModule.execute("");
      let hexResult = hexEncode(result) as string;

      hexResult = hexResult.replace(/000d/g, '');
      hexResult = hexResult.replace(/000a/g, '');
      // hexResult = hexResult.replace(/0002/g, '');

      let hexExpected = hexEncode(response);
      // hexExpected = hexExpected.replace(/0002/g, '');
      expect(hexResult).toBe(hexExpected);
    });

    // test("can process a response and return a new config", async () => {
    //   const timestamp = 1654012158
    //   myModule.initialize(config, timestamp);
    //   const result = myModule.main(response_swaps);
    //   let hexResult = hexEncode(result) as string;
    //   hexResult = hexResult.replace(/000d/g, '');
    //   const hexExpected = hexEncode(secondCall);
    //   expect(hexResult).toBe(hexExpected);
    // });

    test("can process the final response and return true for callback termination", async () => {

      myModule = await loadWasm(fs.readFileSync(__dirname + "/../build/debug.wasm"), {})

      const _response = '[{"type":"BigNumber","hex":"0x01000075f010fe2de91b862e8b"},5,0,1,1,0,true]'
      const slotConfig = '{"isChainRead": true, "address" : "0x8956814c346300D554cA5598C5a78578C51a394f"}'

      const timestamp = 1654012158
      myModule.initialize(slotConfig);
      // myModule.main(output);
      const result = myModule.execute(_response);
      expect(result).toBe("true");
    });

    test("can run transformation and return CT", async () => {
      myModule = await loadWasm(fs.readFileSync(__dirname + "/../build/debug.wasm"), {})
      const timestamp = 1654012158
      myModule.initialize(config);
      const _response = '[{"type":"BigNumber","hex":"0x01000075f010fe2de91b862e8b"},7,0,1,1,0,true]'
      myModule.execute(_response);
      const result = myModule.transform();
      // let hexResult = hexEncode(result) as string;
      // hexResult = hexResult.replace(/000d/g, '');
      // const hexExpected = hexEncode(candles);
      expect(result).toBe('7');
    });

  });
});
