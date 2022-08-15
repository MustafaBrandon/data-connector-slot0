import { config, input_config, response } from "./utils";

// We use untouched so that we can run the un-optimized version of the wasm which will provide better stacktraces
const myModule = require("../untouchLoader");

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
  describe("Uniswap Data", () => {
    test("can return input config", async () => {
      // Call the configForm function on the transformation bundle
      const result = myModule.configForm();
      // Check that the result is the same as the expected result
      // Fix some funky encoding
      let hexResult = hexEncode(result) as string;
      hexResult = hexResult.replace(/000d/g, '');
      const hexExpected = hexEncode(input_config);
  expect(hexResult).toEqual(hexExpected);
  });

    test("fails imporper config", async () => {
      let configMemoryRef = myModule.__pin(
        myModule.__newString(
          `{"config":"null"}`
        )
      );
      const timestamp = 1654012158
      // The actual strategy instantiation and execution
      expect(() => {
        myModule.initialize(configMemoryRef, timestamp);
      }).toThrowError(/Cannot parse JSON/);
    });

    test("can return call obj", async () => {
      const timestamp = 1654012158
      // const _config = myModule.__pin(myModule.__newString(config));
      myModule.initialize(config, timestamp);
      const result = myModule.main("");
      let hexResult = hexEncode(result) as string;
      // hexResult = hexResult.replace(/0002/g, '');
      hexResult = hexResult.replace(/000d/g, '');
      const hexExpected = hexEncode(response);
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

    // test("can process the final response and return true for callback termination", async () => {
    //   const timestamp = 1654012158
    //   myModule.initialize(config, timestamp);
    //   myModule.main(response_swaps);
    //   const result = myModule.main(`{"data":{"swaps":[]}}`);
    //   expect(result).toBe("true");
    // });

    // test("can run transformation and return candles", async () => {
    //   const timestamp = 1654012158
    //   myModule.initialize(config, timestamp);
    //   myModule.main(response_swaps);
    //   const result = myModule.transform();
    //   let hexResult = hexEncode(result) as string;
    //   hexResult = hexResult.replace(/000d/g, '');
    //   const hexExpected = hexEncode(candles);
    //   expect(hexResult).toBe(hexExpected);
    // });

  });
});
