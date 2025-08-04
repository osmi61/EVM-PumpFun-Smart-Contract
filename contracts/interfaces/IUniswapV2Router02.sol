// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IUniswapV2Router02
 * @notice Interface for Uniswap V2 Router
 */
interface IUniswapV2Router02 {
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    )
        external
        payable
        returns (uint amountToken, uint amountETH, uint liquidity);
    function WETH() external view returns (address);
} 