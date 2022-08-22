export const input_config = `{
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
}`

export const config = '{"address" : "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","isChainRead" : true }'

export const response = `{
  "abi" : [{"inputs":[],"name":"slot0","outputs":[{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"},{"internalType":"int24","name":"tick","type":"int24"},{"internalType":"uint16","name":"observationIndex","type":"uint16"},{"internalType":"uint16","name":"observationCardinality","type":"uint16"},{"internalType":"uint16","name":"observationCardinalityNext","type":"uint16"},{"internalType":"uint8","name":"feeProtocol","type":"uint8"},{"internalType":"bool","name":"unlocked","type":"bool"}],"stateMutability":"view","type":"function"}],
  "address" : "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "arguments" : [],
  "method" : "slot0"
}`

export const output = `[{"type":"BigNumber"}, {"type":"BigNumber", "hex": "0x345"}]`