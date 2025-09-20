import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import web3Service from './services/web3Service';
import NFTShop from './components/NFTShop';
import CreatPage from './components/CreatePage';
import Print3D from './components/Print3D';
import './App.css';

const Nav = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const AContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ff2626ff 0%, #ffa013ff 100%);
`;

const NavContainer = styled.div`
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  gap: 8px;
  display: flex;
  font-size: 24px;
  font-weight: bold;
  color: #3b82f6;
  text-decoration: none;
  align-items: center;


  &:hover {
    color: #2563eb;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #f3f4f6;
    color: #3b82f6;
  }

  &.active {
    background: #3b82f6;
    color: white;
  }
`;

const WalletSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 14px;
`;

const Address = styled.span`
  color: #374151;
  font-weight: 500;
`;

const Balance = styled.span`
  color: #059669;
  font-weight: bold;
`;

const ConnectButton = styled.button`
  background: #3b57f6ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const MainContent = styled.main`
  min-height: calc(83vh - 80px);
`;

const Welcome = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  color: white;
`;

const WelcomeTitle = styled.h1`
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const WelcomeSubtitle = styled.p`
  font-size: 20px;
  margin-bottom: 32px;
  opacity: 0.9;
`;

const MainImg = styled.img`
  margin-bottom: 4px;
  width:100%;
  height:65%;
  margin-bottom: 30px;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
`;

const MainBox = styled.div`
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;


const BoxTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const BoxDescription = styled.p`
  opacity: 0.8;
  text-align: left;
`;

const Footer = styled.footer`
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
  padding: 20px;
`;

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const [userAddress, setUserAddress] = useState('');
  const [userBalance, setUserBalance] = useState('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await web3Service.initialize();
      
      // 检查是否已连接
      if (window.ethereum && window.ethereum.selectedAddress) {
        await connectWallet();
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      const address = await web3Service.connectWallet();
      setUserAddress(address);
      
      // 获取余额
      const balance = await web3Service.getBalance(address);
      setUserBalance(parseFloat(balance).toFixed(4));
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('连接钱包失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const IntroPage = () => (
    <Welcome>
      <WelcomeTitle>手办NFT介绍及流程</WelcomeTitle>
      <WelcomeSubtitle>
        在Monad区块链上交易、铸造、打印您的NFT手办
      </WelcomeSubtitle>
      <MainImg src="/asset/lc.jpg"></MainImg>
      <MainGrid>
        <MainBox>

          <BoxTitle>1.购买手办NFT</BoxTitle>
          <BoxDescription>
            🙋使用MON代币购买手办NFT<br></br>
            🗿 您将获得手办NFT资产<br></br>
            📦您能打印多个可调大小的实物手办<br></br>
            🔒任何人均无法解密3D源文件<br></br>
          </BoxDescription>
        </MainBox>
        
        <MainBox>
          <BoxTitle>2.铸造手办NFT</BoxTitle>
          <BoxDescription>
            ✍绘制您的三维模型手办<br></br>
            🛠️上传源文件铸造为手办NFT<br></br>
            🔐NFT映射加密的三维源文件<br></br>
            💰售卖您的铸造的手办NFT<br></br>
          </BoxDescription>
        </MainBox>
        
        <MainBox>
          <BoxTitle>3.打印手办</BoxTitle>
          <BoxDescription>
            🔑密级3D打印机校验用户权限<br></br>
            ⚙️密级3D打印机获取NFT对应手办<br></br>
            🗿 解密手办源文件并打印为实物<br></br>
            📦 仅NFT用户拥有手办制作权
          </BoxDescription>
        </MainBox>
      </MainGrid>
      


    </Welcome>
  );

  return (
    <AContainer>
      <Nav>
        <NavContainer>
          <Logo to="/">
            👺🤞 手办NFT
          </Logo>
          
          <NavLinks>
            <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
              首页
            </NavLink>
            <NavLink to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>
              手办NFT市场
            </NavLink>
            <NavLink to="/createNTF" className={location.pathname === '/createNTF' ? 'active' : ''}>
              铸造手办NFT
            </NavLink>
            <NavLink to="/print3D" className={location.pathname === '/print3D' ? 'active' : ''}>
              打印NFT手办
            </NavLink>
          </NavLinks>

          <WalletSection>
            {userAddress ? (
              <WalletInfo>
                <Address>{formatAddress(userAddress)}</Address>
                <Balance>{userBalance} MON</Balance>
              </WalletInfo>
            ) : (
              <ConnectButton onClick={connectWallet} disabled={loading}>
                {loading ? '连接中...' : '连接钱包'}
              </ConnectButton>
            )}
          </WalletSection>
        </NavContainer>
      </Nav>

      <MainContent>
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route 
            path="/shop" 
            element={
              <NFTShop 
                userAddress={userAddress} 
                userBalance={userBalance}
              />
            } 
          />
          <Route 
            path="/createNTF" 
            element={
              <CreatPage 
                userAddress={userAddress}
              />
            } 
          />
          <Route 
            path="/print3D" 
            element={
              <Print3D 
                userAddress={userAddress}
              />
            } 
          />
        </Routes>
      </MainContent>

      <Footer>
        <p>
          手办NFT- Powered by Monad David | 
          <a 
            href="https://faucet.monad.xyz" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{color: '#60a5fa', marginLeft: '8px'}}
          >
            获取测试代币
          </a>
        </p>
      </Footer>
    </AContainer>
  );
}

export default App;
