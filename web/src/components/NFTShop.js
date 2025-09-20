import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  margin-bottom: 24px;
`;

const BoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const BoxBContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const BoxOption = styled.div`
  background: #eeeeee;
  border-radius: 12px;
  padding: 0px 20px 20px 20px;
  border: 2px solid #e5e7eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
  }
`;

const BoxTitle = styled.h3`
  font-size: 15px;
  font-weight: bold;
  color: #1f2937;
  margin-top: 10px;
  margin-bottom: 8px;
`;

const BoxImg = styled.img`
  margin-bottom: 4px;
  width:100%;
  height:65%;
`;

const BoxDescription = styled.p`
  color: #6b7280;
  margin-top: 2px;
  margin-bottom: 2px;
    font-size: 12px;
`;

const BoxPrice = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #045239ff;
`;

const Button = styled.button`
  width: 100%;
  padding: 2px 2px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: ${props => props.disabled ? '#9ca3af' : '#3b82f6'};
  border: none;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.3s ease;

  &:hover {
    background: ${props => props.disabled ? '#9ca3af' : '#2563eb'};
  }
`;

const buy = (price) =>{
  // 后期完善
  
}

const NFTShop = ({ userAddress, userBalance }) => {

  //当前为测试数据，后期用合约读取
  const loadLists = [{
          name: "财神-背金不漏光",
          disp: "财神背金不漏光，招财进宝守财库，金银满屋不外流，富贵盈门福泽长，财运亨通好运旺",
          img: "/asset/cs.jpg",
          price: 8
      },{
          name: "龟仙人-深藏武道宗师",
          disp: "藏锋守拙，以慈蔼与玩世之姿，寓大智大勇于龟寿之德，护世渡人。",
          img: "/asset/gx.jpg",
          price: 6
      },{
          name: "皇帝-居九宫动乾坤",
          disp: "核心与责任，王稳全盘存，一步系生死，象征领导力与决断，提醒居安思危，守护初心方得始终。",
          img: "/asset/ww.jpg",
          price: 0.0001
      },{
          name: "皇后-横纵斜通吃",
          disp: "象征女性力量，智慧果敢，掌握全局，自由无畏，是策略与权力完美结合的化身。",
          img: "/asset/hh.jpg",
          price: 3
      }
    ];

  return (
    <Container>
      <Header>
        <Title>手办NFT市场</Title>
        <Subtitle>购买手办NFT，打印您的专属手办！</Subtitle>
      </Header>

      <BoxContainer>
       {loadLists.map((listing) => (
         <BoxOption>
          <BoxTitle>{listing.name}</BoxTitle>
          <BoxImg src={listing.img}></BoxImg>
          <BoxDescription>
          {listing.disp}
          </BoxDescription>
          <BoxBContainer>
             <BoxPrice>{listing.price} MON</BoxPrice>
             <Button 
               onClick={buy(listing.price)}
               disabled={ !userAddress || parseFloat(userBalance) < parseFloat(listing.price)}
             >
              '购买'
             </Button>
          </BoxBContainer>         
        </BoxOption>
       ))}             
      </BoxContainer>

    </Container>
  );
};

export default NFTShop;