import { JSON } from "assemblyscript-json";

// Data connector to read the total supply off a contract

// Local Variables
  var supply: string; 
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
"abi" : '[{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]',
"address" : ` + address + `,
"arguments" : '[]',
"method" : 'totalSupply'
}`
    }

    // Parse through the BN object for the hex
    const bigNum = <JSON.Obj>JSON.parse(response);
    const _hex = bigNum.getString("hex")
    if (_hex == null) throw new Error()
    supply = _hex._str;
    return 'true'
  } 

  // Here we are performing no transformation, so we ship the hex value back
  export function transform(): string {
    return `{"data": `+ supply + `}`;
  }

  // An example of what the config object will look like after being created via the configForm
  export function exampleInputConfig(): string {
    return `{"address" : '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', "isChainRead" : true}`
  }

  // Renders the config object in JSON Schema format, which is used
  // by the frontend to display input value options and validate user input.
  export function configForm(): string {
    return `{
  "title": "Calls ERC-20's 'totalSupply' function",
  "description": "Input config for reading the total supply of a token",
  "type": "object",
  "required": [
    "address"
  ],
  "properties": {
    "address": {
      "type": "string",
      "title": "Contract Address",
      "description": "Address of the token to be read"
    },
    "isChainRead" : true
  }
}`; 
  }


