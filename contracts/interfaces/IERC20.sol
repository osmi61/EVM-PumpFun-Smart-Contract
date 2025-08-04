// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title IERC20
 * @notice Interface for ERC20 tokens
 */
interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
} 