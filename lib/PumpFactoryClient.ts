import { ethers } from 'ethers';

/**
 * @title PumpFactoryClient
 * @notice Client library for interacting with PumpFactory contracts
 * @dev Provides a clean interface for launching and trading pump tokens
 */
export class PumpFactoryClient {
    private factory: ethers.Contract;
    private signer: ethers.Signer;

    constructor(factoryAddress: string, signer: ethers.Signer) {
        this.signer = signer;
        this.factory = new ethers.Contract(
            factoryAddress,
            [
                'function launchToken(string name, string symbol) external payable',
                'function buyToken(address token) external payable',
                'function sellToken(address token, uint256 amount) external',
                'function tokens(address token) external view returns (address creator, address tokenAddress, uint256 vReserveEth, uint256 vReserveToken, uint256 rReserveEth, int256 rReserveToken, bool liquidityMigrated)',
                'function getFactoryConfig() external view returns (address uniswapRouter, address WETH, uint256 V_ETH_RESERVE, uint256 V_TOKEN_RESERVE, uint256 R_TOKEN_RESERVE, uint256 TRADE_FEE_BPS, uint256 BPS_DENOMINATOR, uint256 LIQUIDITY_MIGRATION_FEE)'
            ],
            signer
        );
    }

    /**
     * Launch a new pump token
     * @param name Token name
     * @param symbol Token symbol
     * @param initialEth Optional initial ETH to buy tokens with
     * @returns Transaction receipt
     */
    async launchToken(name: string, symbol: string, initialEth?: string): Promise<ethers.ContractTransactionReceipt> {
        const value = initialEth ? ethers.parseEther(initialEth) : 0;
        const tx = await this.factory.launchToken(name, symbol, { value });
        return await tx.wait();
    }

    /**
     * Buy tokens from a pump
     * @param tokenAddress Token contract address
     * @param ethAmount ETH amount to spend
     * @returns Transaction receipt
     */
    async buyToken(tokenAddress: string, ethAmount: string): Promise<ethers.ContractTransactionReceipt> {
        const value = ethers.parseEther(ethAmount);
        const tx = await this.factory.buyToken(tokenAddress, { value });
        return await tx.wait();
    }

    /**
     * Sell tokens back to the pump
     * @param tokenAddress Token contract address
     * @param tokenAmount Token amount to sell
     * @returns Transaction receipt
     */
    async sellToken(tokenAddress: string, tokenAmount: string): Promise<ethers.ContractTransactionReceipt> {
        const amount = ethers.parseEther(tokenAmount);
        const tx = await this.factory.sellToken(tokenAddress, amount);
        return await tx.wait();
    }

    /**
     * Get token information
     * @param tokenAddress Token contract address
     * @returns Token information
     */
    async getTokenInfo(tokenAddress: string) {
        return await this.factory.tokens(tokenAddress);
    }

    /**
     * Get factory configuration
     * @returns Factory configuration
     */
    async getFactoryConfig() {
        return await this.factory.getFactoryConfig();
    }

    /**
     * Calculate expected tokens for ETH amount
     * @param ethAmount ETH amount
     * @param vReserveEth Virtual ETH reserve
     * @param vReserveToken Virtual token reserve
     * @returns Expected token amount
     */
    calculateExpectedTokens(ethAmount: string, vReserveEth: string, vReserveToken: string): string {
        const ethIn = ethers.parseEther(ethAmount);
        const vEth = ethers.parseEther(vReserveEth);
        const vToken = ethers.parseEther(vReserveToken);
        
        const newReserveEth = ethIn + vEth;
        const newReserveToken = (vEth * vToken) / newReserveEth;
        const tokensOut = vToken - newReserveToken;
        
        return ethers.formatEther(tokensOut);
    }
} 