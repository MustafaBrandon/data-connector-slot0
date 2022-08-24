# data-connector-slot0
Current version returns the current tick of a specified pool when called.

Output will be a single integer between -887272 and 887272.

The `slot0()` function on Uniswapv3 pools returns more data than just the current tick, modified versions can return any of these values.

## Parameters
- Address: The address of the Uniswapv3 pool contract (must be on same network as vault) to be called.
- isChainRead: boolean set to true to signal this data connector fetches on-chain data.
