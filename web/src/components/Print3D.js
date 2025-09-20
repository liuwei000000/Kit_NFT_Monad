import styled from 'styled-components';

const BoxMainContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ShopHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 16px;
`;

const BoxContainer = styled.div`
  display: grid;
  grid-template-columns: 280px 280px 280px;
  gap: 24px;
  margin-bottom: 40px;
`;

const BoxIContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 24px;
`;


const BoxOption = styled.div`
  background: #eeeeee;
  border-radius: 12px;
  padding: 0px 20px 20px 20px;
  border: 2px solid #e5e7eb;
  height: 310px;
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
  margin-top : 6px;  
  margin-bottom : 10px;
  &:hover {
    background: ${props => props.disabled ? '#9ca3af' : '#2563eb'};
  }
`;

const Print3D = ({ userAddress }) => {

    const print3d = (name, userAddress) => {
      //给打印机发送打印消息后续完善

      // toast.success(`打印消息发送成功`);     
    }

  const loadLists = [{
          name: "财神-背金不漏光",
          img: "/asset/cs.jpg",
          price: 8
      },
    ];

  return (
    <BoxMainContainer>
      <ShopHeader>
        <Title>打印NFT手办</Title>
      </ShopHeader>

      <BoxContainer>
       {loadLists.map((listing) => (
         <BoxOption>
          <BoxTitle>{listing.name}</BoxTitle>
          <BoxImg src={listing.img}></BoxImg>
          <BoxIContainer><label>数量</label><input type="number" placeholder="数量单位为个"></input></BoxIContainer>
          <BoxIContainer><label>大小</label><input type="number" placeholder="大小高度单位为cm"></input></BoxIContainer>
          <BoxIContainer><label>材质</label>
          <select>
            <option value="sz">树脂</option>
            <option value="tg">碳钢</option>
            <option value="t">钛</option>
            <option value="y">银</option>
          </select>          
          </BoxIContainer>
             <Button onClick={print3d(listing.name, userAddress)}>
                打印
             </Button>
      
        </BoxOption>
       ))}             
      </BoxContainer>
    </BoxMainContainer>
  );
};

export default Print3D;