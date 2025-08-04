// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./IPumpFactory.sol";
import "./PumpToken.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IWETH.sol";
import "./interfaces/IERC20.sol";

contract PumpCloneFactory is IPumpFactory, Ownable, ReentrancyGuard {
    struct TokenInfo {
        address creator;
        address tokenAddress;
        uint256 vReserveEth;
        uint256 vReserveToken;
        uint256 rReserveEth;
        int256 rReserveToken;
        bool liquidityMigrated;
    }

    mapping(address => TokenInfo) public tokens;

    address public uniswapRouter;
    address public WETH;

    uint256 public V_ETH_RESERVE;
    uint256 public V_TOKEN_RESERVE;
    uint256 public R_TOKEN_RESERVE;
    uint256 public TRADE_FEE_BPS;
    uint256 public BPS_DENOMINATOR;
    uint256 public LIQUIDITY_MIGRATION_FEE;
    uint256 public totalFee;

    event TokenLaunched(
        address indexed token,
        string name,
        string symbol,
        address indexed creator
    );
    event TokensPurchased(
        address indexed token,
        address indexed buyer,
        uint256 amount,
        uint256 cost
    );
    event TokensSold(
        address indexed token,
        address indexed seller,
        uint256 amount,
        uint256 refund
    );
    event LiquiditySwapped(
        address indexed token,
        uint256 tokenAmount,
        uint256 ethAmount
    );

    event ClaimedFee(uint256 amount);

    constructor(address _router) Ownable(msg.sender) {
        uniswapRouter = _router;
        WETH = IUniswapV2Router02(_router).WETH();

        V_ETH_RESERVE = 15 ether / 1000;
        V_TOKEN_RESERVE = 1073000000 ether;
        R_TOKEN_RESERVE = 793100000 ether;
        TRADE_FEE_BPS = 100; // 1% fee in basis points
        BPS_DENOMINATOR = 10000;
        LIQUIDITY_MIGRATION_FEE = 18 ether / 1000;
    }

    function launchToken(
        string memory _name,
        string memory _symbol
    ) external payable override {
        PumpToken token = new PumpToken(_name, _symbol, msg.sender);
        // For your custom token, you can add any additional logic here
        emit TokenLaunched(address(token), _name, _symbol, msg.sender);
    }

    function _calculateReserveAfterBuy(
        uint256 reserveEth,
        uint256 reserveToken,
        uint256 ethIn
    ) internal pure returns (uint256, uint256) {
        uint256 newReserveEth = ethIn + reserveEth;
        uint256 newReserveToken = (reserveEth * reserveToken) / newReserveEth;
        return (newReserveEth, newReserveToken);
    }

    function buyToken(address _token) external payable override nonReentrant {
        // For your custom token, you can add any additional logic here
        emit TokensPurchased(_token, msg.sender, tokensOut, msg.value);
    }

    function sellToken(
        address _token,
        uint256 tokenAmount
    ) external override nonReentrant {
        // For your custom token, you can add any additional logic here

        emit TokensSold(_token, msg.sender, tokenAmount, netEthOut);
    }

    function _addLiquidityToUniswap(address _token) internal {
        TokenInfo storage info = tokens[_token];
        require(
            info.rReserveEth > LIQUIDITY_MIGRATION_FEE,
            "not enough ETH in the liquidity"
        );

        uint256 ethAmount = info.rReserveEth - LIQUIDITY_MIGRATION_FEE;
        uint256 tokenAmount = (info.vReserveEth * ethAmount) / info.vReserveToken;

        PumpToken(_token).mintFromFactory(address(this), tokenAmount);
        IERC20(_token).approve(uniswapRouter, tokenAmount);

        IUniswapV2Router02(uniswapRouter).addLiquidityETH{value: ethAmount}(
            _token,
            tokenAmount,
            0,
            0,
            address(this),
            block.timestamp + 1200
        );

        emit LiquiditySwapped(_token, tokenAmount, ethAmount);
    }

    function getFactoryConfig() external view override returns (
        address uniswapRouter,
        address WETH,
        uint256 V_ETH_RESERVE,
        uint256 V_TOKEN_RESERVE,
        uint256 R_TOKEN_RESERVE,
        uint256 TRADE_FEE_BPS,
        uint256 BPS_DENOMINATOR,
        uint256 LIQUIDITY_MIGRATION_FEE
    ) {
        return (
            uniswapRouter,
            WETH,
            V_ETH_RESERVE,
            V_TOKEN_RESERVE,
            R_TOKEN_RESERVE,
            TRADE_FEE_BPS,
            BPS_DENOMINATOR,
            LIQUIDITY_MIGRATION_FEE
        );
    }

    function updateReserves(uint256 _vEthReserve, uint256 _vTokenReserve, uint256 _rTokenReserve) external onlyOwner {
        V_ETH_RESERVE = _vEthReserve;
        V_TOKEN_RESERVE = _vTokenReserve;
        R_TOKEN_RESERVE = _rTokenReserve;
    }

    function updateFeeRate(uint256 value) external onlyOwner {
        TRADE_FEE_BPS = value;
    }

    function updateLiquidityMigrationFee(uint256 value) external onlyOwner {
        LIQUIDITY_MIGRATION_FEE = value;
    }

    function claimFee(address to) external onlyOwner {
        uint256 feeAmount = totalFee;
        totalFee = 0;
        payable(to).transfer(feeAmount);
        emit ClaimedFee(feeAmount);
    }

    receive() external payable {}
}
