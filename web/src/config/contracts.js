// 合约地址配置 - 部署后需要更新的地址
export const CONTRACTS = {

};

// 网络配置
export const NETWORK_CONFIG = {
  MONAD_TESTNET: {
    chainId: "0x279f", // 10143 in hex
    chainName: "Monad Testnet",
    nativeCurrency: {
      name: "Monad",
      symbol: "MON", 
      decimals: 18,
    },
    rpcUrls: ["https://testnet-rpc.monad.xyz"],
    blockExplorerUrls: ["https://testnet-explorer.monad.xyz"],
  },
};
