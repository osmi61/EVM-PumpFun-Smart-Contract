import { ethers } from 'ethers';
import { PumpFactoryClient } from '../lib/PumpFactoryClient';

/**
 * Example usage of PumpFactoryClient
 * This demonstrates how to interact with the pump factory
 */
async function main() {
    // Connect to provider (example for local development)
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    
    // Get signer (you would use your private key in production)
    const privateKey = process.env.PRIVATE_KEY || '0x...';
    const signer = new ethers.Wallet(privateKey, provider);
    
    // Factory address (deploy this first)
    const factoryAddress = '0x...'; // Replace with actual deployed address
    
    // Create client
    const client = new PumpFactoryClient(factoryAddress, signer);
    
    try {
        // Launch a new token
        console.log('Launching new token...');
        const launchTx = await client.launchToken('MyPumpToken', 'MPT', '0.1');
        console.log('Token launched:', launchTx.hash);
        
        // Get factory config
        const config = await client.getFactoryConfig();
        console.log('Factory config:', config);
        
        // Example: Buy tokens (you would need the actual token address)
        // const tokenAddress = '0x...'; // Token address from launch
        // const buyTx = await client.buyToken(tokenAddress, '0.05');
        // console.log('Tokens bought:', buyTx.hash);
        
        // Example: Sell tokens
        // const sellTx = await client.sellToken(tokenAddress, '1000');
        // console.log('Tokens sold:', sellTx.hash);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run example
if (require.main === module) {
    main().catch(console.error);
} 