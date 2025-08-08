# PumpFactory - Decentralized Token Launch Platform

A decentralized platform for launching and trading pump tokens with automated liquidity migration to Uniswap.

## Features

- **Token Launch**: Create new pump tokens with custom names and symbols
- **Automated Trading**: Buy and sell tokens directly through the factory
- **Liquidity Migration**: Automatic migration to Uniswap when conditions are met
- **Fee Collection**: Configurable trading fees
- **Public Interface**: Clean API for external integration

## Architecture

The codebase is organized with a clear separation between public interfaces and internal implementation:

### Public Components
- `IPumpFactory.sol` - Public interface for external contracts
- `PumpFactoryClient.ts` - TypeScript client library
- `examples/` - Usage examples and documentation

### Internal Components
- `PumpFactory.sol` - Main factory implementation
- `PumpToken.sol` - ERC20 token implementation
- `interfaces/` - External contract interfaces

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Deploy Contracts
```bash
npx hardhat compile
npx hardhat run scripts/deployPump.ts --network <your-network>
```

### 3. Use the Client Library
```typescript
import { PumpFactoryClient } from './lib/PumpFactoryClient';

const client = new PumpFactoryClient(factoryAddress, signer);

// Launch a new token
await client.launchToken('MyToken', 'MTK', '0.1');

// Buy tokens
await client.buyToken(tokenAddress, '0.05');

// Sell tokens
await client.sellToken(tokenAddress, '1000');
```

## API Reference

### PumpFactoryClient

#### `launchToken(name: string, symbol: string, initialEth?: string)`
Launches a new pump token with optional initial ETH purchase.

#### `buyToken(tokenAddress: string, ethAmount: string)`
Buys tokens from the pump using ETH.

#### `sellToken(tokenAddress: string, tokenAmount: string)`
Sells tokens back to the pump for ETH.

#### `getTokenInfo(tokenAddress: string)`
Retrieves token information including reserves and migration status.

#### `getFactoryConfig()`
Gets factory configuration including fees and reserves.

## Contract Interfaces

### IPumpFactory
Public interface exposing core functionality:
- `launchToken()` - Launch new tokens
- `buyToken()` - Purchase tokens
- `sellToken()` - Sell tokens
- `tokens()` - Get token info
- `getFactoryConfig()` - Get factory settings

## Development

### Compile Contracts
```bash
npx hardhat compile
```

### Run Tests
```bash
npx hardhat test
```

### Deploy to Network
```bash
npx hardhat run scripts/deployPump.ts --network <network-name>
```

## Security

- All external functions use `nonReentrant` modifier
- Owner-only functions for configuration updates
- Proper access controls on token minting
- Safe math operations (Solidity 0.8.28)

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For questions or issues, please open an issue on GitHub.

### 👤 Author
#### Twitter: [@KEI_NOVAK](https://x.com/kei_4650)   
#### Telegram: [@KEI_NOVAK](https://t.me/Kei4650)  
