import { ethers } from "hardhat";

async function main() {
  console.log("Deploying PumpFactory...");

  // Get the contract factory
  const PumpFactory = await ethers.getContractFactory("PumpCloneFactory");
  
  // Uniswap V2 Router addresses for different networks
  const routerAddresses = {
    mainnet: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    goerli: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    sepolia: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    polygon: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
    bsc: "0x10ED43C718714eb63d5aA57B78B54704E256024E"
  };

  // Get network
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  
  // Select router based on network
  let routerAddress: string;
  switch (chainId) {
    case 1: // mainnet
      routerAddress = routerAddresses.mainnet;
      break;
    case 5: // goerli
      routerAddress = routerAddresses.goerli;
      break;
    case 11155111: // sepolia
      routerAddress = routerAddresses.sepolia;
      break;
    case 137: // polygon
      routerAddress = routerAddresses.polygon;
      break;
    case 56: // bsc
      routerAddress = routerAddresses.bsc;
      break;
    default:
      routerAddress = routerAddresses.mainnet; // fallback
  }

  console.log(`Deploying to network: ${network.name} (${chainId})`);
  console.log(`Using router: ${routerAddress}`);

  // Deploy the contract
  const factory = await PumpFactory.deploy(routerAddress);
  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log("PumpFactory deployed to:", factoryAddress);

  // Verify deployment
  const deployedFactory = PumpFactory.attach(factoryAddress);
  const owner = await deployedFactory.owner();
  const uniswapRouter = await deployedFactory.uniswapRouter();
  
  console.log("Owner:", owner);
  console.log("Uniswap Router:", uniswapRouter);
  console.log("Deployment successful!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 