import { expect } from "chai";
import { ethers } from "hardhat";
import { PumpFactoryClient } from "../lib/PumpFactoryClient";

describe("PumpFactory Public Interface", function () {
  let factory: any;
  let client: PumpFactoryClient;
  let owner: any;
  let user: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    
    // Deploy factory
    const PumpFactory = await ethers.getContractFactory("PumpCloneFactory");
    factory = await PumpFactory.deploy("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"); // Uniswap V2 Router
    
    // Create client
    client = new PumpFactoryClient(await factory.getAddress(), user);
  });

  describe("Token Launch", function () {
    it("Should launch a new token", async function () {
      const tx = await client.launchToken("TestToken", "TEST");
      expect(tx.status).to.equal(1);
    });

    it("Should launch token with initial ETH purchase", async function () {
      const tx = await client.launchToken("TestToken", "TEST", "0.1");
      expect(tx.status).to.equal(1);
    });
  });

  describe("Token Trading", function () {
    let tokenAddress: string;

    beforeEach(async function () {
      // Launch a token first
      await client.launchToken("TestToken", "TEST");
      // Get token address from events (simplified)
      tokenAddress = await factory.tokens(0); // This is simplified
    });

    it("Should allow buying tokens", async function () {
      const tx = await client.buyToken(tokenAddress, "0.05");
      expect(tx.status).to.equal(1);
    });

    it("Should allow selling tokens", async function () {
      // First buy some tokens
      await client.buyToken(tokenAddress, "0.05");
      
      // Then sell them
      const tx = await client.sellToken(tokenAddress, "1000");
      expect(tx.status).to.equal(1);
    });
  });

  describe("Factory Configuration", function () {
    it("Should return factory configuration", async function () {
      const config = await client.getFactoryConfig();
      expect(config).to.have.property('uniswapRouter');
      expect(config).to.have.property('TRADE_FEE_BPS');
    });
  });

  describe("Token Information", function () {
    it("Should return token information", async function () {
      await client.launchToken("TestToken", "TEST");
      const tokenInfo = await client.getTokenInfo("0x..."); // Token address
      expect(tokenInfo).to.have.property('creator');
      expect(tokenInfo).to.have.property('liquidityMigrated');
    });
  });

  describe("Price Calculation", function () {
    it("Should calculate expected tokens correctly", function () {
      const expected = client.calculateExpectedTokens("0.1", "0.015", "1073000000");
      expect(expected).to.be.a('string');
      expect(parseFloat(expected)).to.be.greaterThan(0);
    });
  });
}); 