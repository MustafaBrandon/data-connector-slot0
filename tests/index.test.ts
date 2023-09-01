import { config, input_config, response } from "./utils";
import fs from 'fs'
import {WasmModule, loadWasm} from "@steerprotocol/app-loader";

// We use untouched so that we can run the un-optimized version of the wasm which will provide better stacktraces
// const myModule = require("../untouchLoader");

describe("WASM Transformation Module", () => {
  let myModule: WasmModule;

  beforeEach(async () => {
    myModule = await loadWasm(fs.readFileSync(__dirname + "/../build/debug.wasm"), {})
  });
  describe("Uniswap Data", () => {
    test("can return input config", async () => {
      // Call the configForm function on the transformation bundle
      const result = myModule.config();
      // fs.writeFileSync('./scf.json',  result)
      // Check that the result is the same as the expected result
      const parsedResult = JSON.parse(result)
      // console.log('true')
  expect(JSON.stringify(parsedResult)).toEqual(JSON.stringify(JSON.parse(input_config)));
  });

    test("fails imporper config", async () => {
      const improperConfig = `{"config":"null"}`
      const timestamp = 1654012158
      // The actual strategy instantiation and execution
      expect(() => {
        myModule.initialize(improperConfig);
      }).toThrowError();
    });

    test("can return call obj", async () => {
      myModule.initialize(config);
      const result = myModule.execute("");
      // console.log(result)

      expect(JSON.stringify(JSON.parse(result))).toBe(JSON.stringify(JSON.parse(response)));
    });

    test("can process the final response and return true for callback termination", async () => {

      const _response = '[{"type":"BigNumber","hex":"0x01000075f010fe2de91b862e8b"},5,0,1,1,0,true]'
      const slotConfig = '{"isChainRead": true, "poolAddress" : "0x8956814c346300D554cA5598C5a78578C51a394f", "chainId": 137}'
      myModule.initialize(slotConfig);
      const result = myModule.execute(_response);
      expect(result).toBe("true");
    });

    test("can run transformation and return CT - positive", async () => {
      myModule = await loadWasm(fs.readFileSync(__dirname + "/../build/debug.wasm"), {})
      myModule.initialize(config);
      const _response = '[{"type":"BigNumber","hex":"0x01000075f010fe2de91b862e8b"},7,0,1,1,0,true]'
      myModule.execute(_response);
      const result = myModule.transform();
      expect(result).toBe('7');
    });

    test("can run transformation and return CT - negative", async () => {
      myModule = await loadWasm(fs.readFileSync(__dirname + "/../build/debug.wasm"), {})
      myModule.initialize(config);
      const _response = '[{"type":"BigNumber","hex":"0x01000075f010fe2de91b862e8b"},-7,0,1,1,0,true]'
      myModule.execute(_response);
      const result = myModule.transform();
      expect(result).toBe('-7');
    });

  });
});
