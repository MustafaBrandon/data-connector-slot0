export const input_config = `{
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
}`

export const config = '{"address" : "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","isChainRead" : true }'

export const response = `{
"abi" : '[{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]',
"address" : 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48,
"arguments" : '[]',
"method" : 'totalSupply'
}`