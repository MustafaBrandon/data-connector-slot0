import { JSON } from "json-as/assembly";
import {  DataConnectorConfig, ExecutionContext  } from "@steerprotocol/strategy-utils/assembly";

// Data connector to read the total supply off a contract


// Local Variables
  var tick: i64; 
  var chainId: string = "";
  var address: string = "";

  @serializable
  class Config extends DataConnectorConfig{
    chainId: string = "";
    address: string = "";
  }

  // Initializes variables from the config file
  export function initialize(config: string): void {
    // parse through the config and assing locals
    const configJson: Config = JSON.parse<Config>(config);
    if (configJson.chainId == null ||
    configJson.address == null) {
      throw new Error("Config not properly formatted");
    }
    chainId = configJson.chainId;
    address = configJson.address;
  }


  export function execute(response: string): string {
    // Check if respone is first call
    if (response == ''){
      // return payload
      return `{
"abi" : [{"inputs":[],"name":"slot0","outputs":[{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"},{"internalType":"int24","name":"tick","type":"int24"},{"internalType":"uint16","name":"observationIndex","type":"uint16"},{"internalType":"uint16","name":"observationCardinality","type":"uint16"},{"internalType":"uint16","name":"observationCardinalityNext","type":"uint16"},{"internalType":"uint8","name":"feeProtocol","type":"uint8"},{"internalType":"bool","name":"unlocked","type":"bool"}],"stateMutability":"view","type":"function"}],
"address" : \"` + address + `\",
"arguments" : [],
"method" : "slot0",
"chainId" : ` + chainId + `
}`
    }

    // Parse through the array
    // ie: `[{_hex: "0x15f6d3cb5f0f9ce3a350efe8",_isBigNumber: true,},-49118,0,1,1,0,true,]`
    // First element might be a big number object, check if so, and then splice for the value and parse
    if (response.length <= 8) throw new Error("Corrupt Chain Call Data");

    let currentTickString: string;
    // see if first element is ethers bn obj
    if (response.at(1) == '{') {
      // we might have a trailing comma in the bn obj
      const onlyNumbers = response.split('}')[1];
      const splitData = onlyNumbers.split(',');
      // our value is at index 1 
      currentTickString = splitData[1];
    }
    else {
      // unlikely but if the encoding gives us the first number as js number
      const splitData = response.split(',');
      // our value is at index 1
      currentTickString = splitData[1];
    }
    const currentTick = i64(parseFloat(currentTickString))
    tick = currentTick;
    return 'true';
  } 

  // Here we are performing no transformation, so we ship the hex value back
  export function transform(): string {
    // Convert hex string to int
    // const tick_number = parseInt(tick,16);
    return tick.toString();
  }

  // Renders the config object in JSON Schema format, which is used
  // by the frontend to display input value options and validate user input.
  export function config(): string {
    return `{
  "title": "Calls Uniswapv3 pool's slot0 function",
  "description": "Input config for reading the slot0 function on a Uniswapv3 pool",
  "type": "object",
  "required": [
    "address"
  ],
  "properties": {
    "address": {
      "type": "string",
      "title": "Contract Address",
      "description": "Address of the uniswapv3 pool contract"
    },
    "chainId": {
      "type": "string",
      "title": "Chain ID",
      "description": "ChainId from which the view function will be called",
      "detailedDescription": "Example, the Polygon Mainnet has a chain ID of '137'. You can refer to the Steer documentation to find the full list of supported networks and their corresponding chain IDs. By specifying the correct chain ID, you can ensure that your view function is called on the intended network"
    },
    "isChainRead" : {
      "type": "boolean",
      "title": "Is this a view or pure contract call?",
      "default": true,
      "hidden":true
    }
  }
}`; 
  }
