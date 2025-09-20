import { ethers } from 'ethers';
import { CONTRACTS, NETWORK_CONFIG } from '../config/contracts';

// ABI定义 - 简化版，包含主要函数
export const FANTASY_CARD_ABI = [
  "function mintCard(address to, uint8 rarity) external returns (uint256)",
  "function cards(uint256 tokenId) external view returns (uint256 id, string name, uint8 rarity, uint256 attack, uint256 health, string imageURI, uint256 mintTime)",
  "function getCardsByOwner(address owner) external view returns (uint256[])",
  "function totalSupply() external view returns (uint256)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function approve(address to, uint256 tokenId) external",
  "function setApprovalForAll(address operator, bool approved) external",
  "function balanceOf(address owner) external view returns (uint256)",
  "event CardMinted(address indexed to, uint256 indexed tokenId, uint8 rarity)"
];

export const CARD_PACK_ABI = [
  "function openPack() external payable",
  "function openBulkPack() external payable",
  "function userPackCount(address user) external view returns (uint256)",
  "function getUserStats(address user) external view returns (uint256 totalPacks, uint256 packsSinceLastEpic, bool guaranteeNext)",
  "event PackOpened(address indexed user, uint256 indexed tokenId, uint8 rarity)",
  "event BulkPackOpened(address indexed user, uint256 packCount, uint256[] tokenIds)"
];

export const MARKETPLACE_ABI = [
  "function listCard(uint256 tokenId, uint256 price) external",
  "function buyCard(uint256 tokenId) external payable",
  "function placeBid(uint256 tokenId) external payable",
  "function acceptBid(uint256 tokenId, uint256 bidIndex) external",
  "function cancelListing(uint256 tokenId) external",
  "function getActiveListings(uint256 offset, uint256 limit) external view returns (uint256[] tokenIds, address[] sellers, uint256[] prices, uint256 total)",
  "function getBids(uint256 tokenId) external view returns (address[] bidders, uint256[] amounts, uint256[] timestamps, bool[] isActiveArray)",
  "function getHighestBid(uint256 tokenId) external view returns (address bidder, uint256 amount, uint256 timestamp)",
  "event CardListed(uint256 indexed tokenId, address indexed seller, uint256 price)",
  "event CardSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price)",
  "event BidPlaced(uint256 indexed tokenId, address indexed bidder, uint256 amount)"
];

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {};
  }

  // 初始化Web3连接
  async initialize() {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      await this.switchToMonadTestnet();
      return true;
    } else {
      throw new Error('Please install MetaMask!');
    }
  }

  // 连接钱包
  async connectWallet() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.signer = this.provider.getSigner();
      const address = await this.signer.getAddress();
      this.initializeContracts();
      return address;
    } catch (error) {
      throw new Error('Failed to connect wallet: ' + error.message);
    }
  }

  // 切换到Monad测试网
  async switchToMonadTestnet() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG.MONAD_TESTNET.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORK_CONFIG.MONAD_TESTNET],
          });
        } catch (addError) {
          throw new Error('Failed to add Monad Testnet');
        }
      } else {
        throw new Error('Failed to switch to Monad Testnet');
      }
    }
  }

  // 初始化合约实例
  initializeContracts() {
    if (!this.signer) return;

    this.contracts.fantasyCard = new ethers.Contract(
      CONTRACTS.FANTASY_CARD,
      FANTASY_CARD_ABI,
      this.signer
    );

    this.contracts.cardPack = new ethers.Contract(
      CONTRACTS.CARD_PACK,
      CARD_PACK_ABI,
      this.signer
    );

    this.contracts.marketplace = new ethers.Contract(
      CONTRACTS.MARKETPLACE,
      MARKETPLACE_ABI,
      this.signer
    );
  }

  // 获取用户卡片
  async getUserCards(address) {
    try {
      const tokenIds = await this.contracts.fantasyCard.getCardsByOwner(address);
      const cards = [];
      
      for (let tokenId of tokenIds) {
        const cardData = await this.contracts.fantasyCard.cards(tokenId);
        cards.push({
          id: tokenId.toNumber(),
          name: cardData.name,
          rarity: cardData.rarity,
          attack: cardData.attack.toNumber(),
          health: cardData.health.toNumber(),
          imageURI: cardData.imageURI,
          mintTime: cardData.mintTime.toNumber()
        });
      }
      
      return cards;
    } catch (error) {
      console.error('Error fetching user cards:', error);
      throw error;
    }
  }

  // 开单包
  async openSinglePack() {
    try {
      const tx = await this.contracts.cardPack.openPack({
        value: ethers.utils.parseEther("0.01")
      });
      return await tx.wait();
    } catch (error) {
      console.error('Error opening pack:', error);
      throw error;
    }
  }

  // 开100包
  async openBulkPack() {
    try {
      const tx = await this.contracts.cardPack.openBulkPack({
        value: ethers.utils.parseEther("1.0")
      });
      return await tx.wait();
    } catch (error) {
      console.error('Error opening bulk pack:', error);
      throw error;
    }
  }

  // 上架卡片
  async listCard(tokenId, price) {
    try {
      // 首先授权marketplace合约
      await this.contracts.fantasyCard.approve(CONTRACTS.MARKETPLACE, tokenId);
      
      // 然后上架
      const priceWei = ethers.utils.parseEther(price.toString());
      const tx = await this.contracts.marketplace.listCard(tokenId, priceWei);
      return await tx.wait();
    } catch (error) {
      console.error('Error listing card:', error);
      throw error;
    }
  }

  // 购买卡片
  async buyCard(tokenId, price) {
    try {
      const tx = await this.contracts.marketplace.buyCard(tokenId, {
        value: ethers.utils.parseEther(price.toString())
      });
      return await tx.wait();
    } catch (error) {
      console.error('Error buying card:', error);
      throw error;
    }
  }

  // 竞价
  async placeBid(tokenId, bidAmount) {
    try {
      const tx = await this.contracts.marketplace.placeBid(tokenId, {
        value: ethers.utils.parseEther(bidAmount.toString())
      });
      return await tx.wait();
    } catch (error) {
      console.error('Error placing bid:', error);
      throw error;
    }
  }

  // 获取市场列表
  async getMarketListings(offset = 0, limit = 20) {
    try {
      const result = await this.contracts.marketplace.getActiveListings(offset, limit);
      const listings = [];
      
      for (let i = 0; i < result.tokenIds.length; i++) {
        const tokenId = result.tokenIds[i].toNumber();
        const cardData = await this.contracts.fantasyCard.cards(tokenId);
        
        listings.push({
          tokenId,
          seller: result.sellers[i],
          price: ethers.utils.formatEther(result.prices[i]),
          card: {
            id: tokenId,
            name: cardData.name,
            rarity: cardData.rarity,
            attack: cardData.attack.toNumber(),
            health: cardData.health.toNumber(),
            imageURI: cardData.imageURI
          }
        });
      }
      
      return {
        listings,
        total: result.total.toNumber()
      };
    } catch (error) {
      console.error('Error fetching market listings:', error);
      throw error;
    }
  }

  // 获取卡片竞价
  async getCardBids(tokenId) {
    try {
      const result = await this.contracts.marketplace.getBids(tokenId);
      const bids = [];
      
      for (let i = 0; i < result.bidders.length; i++) {
        if (result.isActiveArray[i]) {
          bids.push({
            bidder: result.bidders[i],
            amount: ethers.utils.formatEther(result.amounts[i]),
            timestamp: result.timestamps[i].toNumber()
          });
        }
      }
      
      return bids;
    } catch (error) {
      console.error('Error fetching bids:', error);
      throw error;
    }
  }

  // 获取用户余额
  async getBalance(address) {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }
}

export default new Web3Service();