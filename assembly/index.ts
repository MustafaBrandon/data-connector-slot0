import { JSON } from "json-as/assembly";
import {  DataConnectorConfig, ExecutionContext  } from "@steerprotocol/strategy-utils/assembly";
import { console } from "@steerprotocol/strategy-utils/assembly/utils/console";
// Data connector to read the total supply off a contract


// Local Variables
  var tick: i64; 
  var chainId: string = "";
  var poolAddress: string = "";

  @serializable
  class Config extends DataConnectorConfig{
    chainId: string = "";
    poolAddress: string = "";
  }

  // Initializes variables from the config file
  export function initialize(config: string): void {
    // parse through the config and assing locals
    const configJson: Config = JSON.parse<Config>(config);
    if (configJson.chainId == null ||
    configJson.poolAddress == null) {
      throw new Error("Config not properly formatted");
    }
    chainId = configJson.chainId;
    poolAddress = configJson.poolAddress;
  }


  export function execute(response: string): string {
    // Check if respone is first call
    if (response == ''){
      // return payload
      return `{
"abi" : [{"inputs": [], "name": "globalState", "outputs": [ { "internalType": "uint160", "name": "price", "type": "uint160" }, { "internalType": "int24", "name": "tick", "type": "int24" }, { "internalType": "int24", "name": "prevInitializedTick", "type": "int24" }, { "internalType": "uint16", "name": "fee", "type": "uint16" }, { "internalType": "uint16", "name": "timepointIndex", "type": "uint16" }, { "internalType": "uint8", "name": "communityFee", "type": "uint8" }, { "internalType": "bool", "name": "unlocked", "type": "bool" } ], "stateMutability": "view", "type": "function"}],
"address" : \"` + poolAddress + `\",
"arguments" : [],
"method" : "globalState",
"chainId" : ` + chainId + `
}`
    }

    // Parse through the array
    // First element might be a big number object, check if so, and then splice for the value and parse
    if (response.length <= 8) throw new Error("Corrupt Chain Call Data");

    let currentTickString: string;
    // see if first element is ethers bn obj
    if (response.at(1) == '{') {
      const splitData = response.split(',');
      // our value is at index 2
      currentTickString = splitData[2];
    }
    else {
      // unlikely but if the encoding gives us the first number as js number
      const splitData = response.split(',');
      // our value is at index 1
      currentTickString = splitData[1];
    }

    console.log('Current tick string : '+currentTickString)
    const currentTick = i64(parseInt(currentTickString));
    // if (currentTick == null) throw new Error(); // "Basic types cannot be nullable"
    console.log('Current tick string : '+currentTick.toString())
    tick = currentTick;

    console.log('Current tick string : '+tick.toString())
    return 'true';
  } 

  // Here we are performing no transformation, so we ship the hex value back
  export function transform(): string {
    // Convert hex string to int
    // const tick_number = parseInt(tick,16);
    const originTick = i64.parse(tick.toString());

    console.log('Current tick'+tick.toString()+" Parsed one "+originTick.toString())
    return tick.toString();
  }

  // Renders the config object in JSON Schema format, which is used
  // by the frontend to display input value options and validate user input.
  export function config(): string {
    return `{
  "title": "Calls Algebra pool's slot0 function",
  "description": "Input config for reading the slot0 function on a AlgebraV3 pool",
  "type": "object",
  "required": [
    "poolAddress"
  ],
  "properties": {
    "poolAddress": {
      "type": "string",
      "title": "Contract Address",
      "description": "Address of the pool to be read"
    },
    "chainId": {
      "type": "string",
      "title": "Chain ID",
      "description": "Chain from which to call view function (i.e. Ethereum Mainnet would be '1' and Polygon Mainnet is '137', check the documentation for the full list of supported chains)"
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
