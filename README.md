# data-connector-slot0

Current version returns the current tick of a specified Uniswapv3 pool when called.

Output will be a single integer between -887272 and 887272.

The `slot0()` function on Uniswapv3 pools returns more data than just the current tick, modified versions can return any of these values.

## Parameters

- Address: The address of the Uniswapv3 pool contract (must be on same network as vault) to be called.
- ChainID: The chain ID of the network to make the contract call.
- isChainRead: boolean set to true to signal this data connector to fetch only the on-chain data.

### Project Setup

Once cloned, you will need to install the project dependencies. This can be done via the following command:

  `yarn install`

### Project Structure

Data Connectors have 3 functions that will be directly called by the Keeper nodes during runtime. These functions are necessary along with configuration form function, other helper functions and classes will likely be helpful. For more information please see the Data Connector Interface. However, this design means that as a developer you only need to implement the methods which are required for the data connector to work.

Below are the significant files and folders which you will want to get familiar with:
```
├── assembly      // Source code for the data connector
├── build         // Output of the build process aka `yarn asbuild`
├── coverage      // Coverage report for testing
├── tests         // Test files with a built in test runner
├── asconfig.json // Assemblyscript config
├── index.js      // Javascript entrypoint for the data connector when running tests
├── package.json  // Dependencies for the data connector
```

## INFO

You will notice that there is a post-install script which will compile the ./assembly source folder and populate the ./build folder. This is done to make it easier to run the tests. We will cover this later.

Once you have set up your project, you can begin defining your data connector.

Access off and on chain data with [Steer Protocol](https://steer.finance). Execution bundles can use data connectors to expand your smart contract capabilities with off-chain data! More info can be found here: [Documentation](https://docs.steer.finance/data-connectors/writing-a-data-connector)

## TIP

The Steer Protocol Strategy Template for AssemblyScript can be found here: [https://github.com/SteerProtocol/strategy-template-assemblyscript](https://github.com/SteerProtocol/strategy-template-assemblyscript)
