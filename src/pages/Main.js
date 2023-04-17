import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import '../Font.css';

const ICON_RESOURCE_PATH = process.env.PUBLIC_URL + "/icon";

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const TitleWrapper = styled.div`
    margin: 0;
    text-align: center;
`;
const SubTitle = styled.h2`
    transform: translate(0, -70%);
`;

const Description = styled.div`
    text-align: center;
    margin: 0;
    border: 1px solid #FF62B7;
    box-sizing: border-box;
    border-radius: 8px;
    text-align: left;
    padding: 20px;
    flex-direction: column;
`;

// const DescriptionContent = styled.pre`
//     left: -10%;
// `; 
const LinkWrapper = styled.div`
    padding: 3rem;
    font-size: 20px;
    text-align: center;
    text-decoration: none;
`;

const LinkStlye = {
    color: 'black',
    textDecoration: 'none',
    '&:hover': {
        color: 'violet'
    }
};

const StyledTitleText = styled.div`
    font-family: NanumNeoEB;
    font-size: 30px;
`;

const StyledConText = styled.pre`
    font-family: NanumNeoB;
    font-size: 20px;
`;

const StyledImgBox = styled.div`
    background-image: url('${process.env.PUBLIC_URL}/icon/box.png');
    width: 600px;
    height: 300px;
    object-fit: contain;
    position: relative;
`;
const StyledTxtBox = styled.div`
`;
// const StyledHeader = styled.header`
//   font-family: NanumNeo;
//   margin-top: 40px;
//   font-size: 50px;
//   color: #736FA0;
// `;

export default function Main() {
    const descriptionContent = 
    `     1. 방 만들기 버튼 클릭
     
     2. 생일인 사람의 생일, 이메일을 적기
     
     3. 생성된 방에서 편지 작성 및 선물 등록하기

     4. 다른 친구에게 링크를 공유하기
    
    생일이 되면 자동으로 메세지 및 선물 확인을 위한 이메일이 전송됩니다.`;
        
    return (
    <PageContainer>
        <TitleWrapper>
            <img alt="MainTitle" width = '600' height = '500' src={ ICON_RESOURCE_PATH + '/Title.png' }/>
        </TitleWrapper>

        <Description>
            <StyledTitleText>Birthday Postbox : 생일빵의 이용방법은 다음과 같습니다.</StyledTitleText>
            <StyledConText>{descriptionContent}</StyledConText>
        </Description>

{/* 
        <StyledImgBox>
            <StyledTxtBox>
                <DescriptionContent>{descriptionContent}</DescriptionContent>
            </StyledTxtBox>
        </StyledImgBox> */}
        
        
        <LinkWrapper>
            <Link to="/CreateRoom" style={LinkStlye}><img  alt="Button" width = '150' height = '200' src={ ICON_RESOURCE_PATH + '/Button_CreateRoom.png' }/></Link>
        </LinkWrapper>
    </PageContainer>
    );
}