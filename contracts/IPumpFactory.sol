// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IPumpFactory
 * @notice Public interface for PumpFactory - allows external contracts to interact with the pump factory
 * @dev This interface exposes only the necessary functions for external interaction
 */
interface IPumpFactory {
    /**
     * @notice Launch a new pump token
     * @param _name Token name
     * @param _symbol Token symbol
     */
    function launchToken(string memory _name, string memory _symbol) external payable;
    
    /**
     * @notice Buy tokens from the pump
     * @param _token Token address to buy
     */
    function buyToken(address _token) external payable;
    
    /**
     * @notice Sell tokens back to the pump
     * @param _token Token address to sell
     * @param tokenAmount Amount of tokens to sell
     */
    function sellToken(address _token, uint256 tokenAmount) external;
    
    /**
     * @notice Get token information
     * @param _token Token address
     * @return creator Token creator address
     * @return tokenAddress Token contract address
     * @return vReserveEth Virtual ETH reserve
     * @return vReserveToken Virtual token reserve
     * @return rReserveEth Real ETH reserve
     * @return rReserveToken Real token reserve
     * @return liquidityMigrated Whether liquidity has been migrated to Uniswap
     */
    function tokens(address _token) external view returns (
        address creator,
        address tokenAddress,
        uint256 vReserveEth,
        uint256 vReserveToken,
        uint256 rReserveEth,
        int256 rReserveToken,
        bool liquidityMigrated
    );
    
    /**
     * @notice Get factory configuration
     * @return uniswapRouter Uniswap router address
     * @return WETH WETH address
     * @return V_ETH_RESERVE Virtual ETH reserve constant
     * @return V_TOKEN_RESERVE Virtual token reserve constant
     * @return R_TOKEN_RESERVE Real token reserve constant
     * @return TRADE_FEE_BPS Trade fee in basis points
     * @return BPS_DENOMINATOR Basis points denominator
     * @return LIQUIDITY_MIGRATION_FEE Liquidity migration fee
     */
    function getFactoryConfig() external view returns (
        address uniswapRouter,
        address WETH,
        uint256 V_ETH_RESERVE,
        uint256 V_TOKEN_RESERVE,
        uint256 R_TOKEN_RESERVE,
        uint256 TRADE_FEE_BPS,
        uint256 BPS_DENOMINATOR,
        uint256 LIQUIDITY_MIGRATION_FEE
    );
} 