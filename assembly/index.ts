import { JSON } from "assemblyscript-json";

// Data connector to read the total supply off a contract

// Local Variables
  var tick: i64; 
  var address: string;

  // Initializes variables from the config file
  export function initialize(config: string, _timestamp: i32): void {
    // parse through the config and assing locals
    const configJson = <JSON.Obj>JSON.parse(config);
    // Get our config variables
    const _address = configJson.getString("address");
    if (_address == null) throw new Error('Invalid Config')
    address = _address._str;
  }


  export function main(response: string): string {
    
    // Check if respone is first call
    if (response == ''){
      // return payload
      return `{
"abi" : [{"inputs":[],"name":"slot0","outputs":[{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"},{"internalType":"int24","name":"tick","type":"int24"},{"internalType":"uint16","name":"observationIndex","type":"uint16"},{"internalType":"uint16","name":"observationCardinality","type":"uint16"},{"internalType":"uint16","name":"observationCardinalityNext","type":"uint16"},{"internalType":"uint8","name":"feeProtocol","type":"uint8"},{"internalType":"bool","name":"unlocked","type":"bool"}],"stateMutability":"view","type":"function"}],
"address" : \"` + address + `\",
"arguments" : [],
"method" : "slot0"
}`
    }

    // Parse through the BN object for the hex
    const slot0Items = <JSON.Arr>JSON.parse(response);
    const bigNum = <JSON.Integer>slot0Items._arr[1]
    if (bigNum == null) throw new Error()
    tick = bigNum._num;
    return 'true'
  } 

  // Here we are performing no transformation, so we ship the hex value back
  export function transform(): string {
    // Convert hex string to int
    // const tick_number = parseInt(tick,16);
    return `{"data": \"`+ tick.toString() + `\"}`;
  }

  // An example of what the config object will look like after being created via the configForm
  export function exampleInputConfig(): string {
    return `{"address" : '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8', "isChainRead" : true}`
  }

  // Renders the config object in JSON Schema format, which is used
  // by the frontend to display input value options and validate user input.
  export function configForm(): string {
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
      "description": "Address of the pool to be read"
    },
    "isChainRead" : {
      "type": "boolean",
      "title": "Is this a view or pure contract call?",
      "default": true
    }
  }
}`; 
  }
