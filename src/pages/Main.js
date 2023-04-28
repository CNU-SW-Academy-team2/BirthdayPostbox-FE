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

const LinkWrapper = styled.div`
    margin: 44px;
    font-size: 20px;
    text-align: center;
    text-decoration: none;
    height: 200px;
    width: 200px;
    border-radius: 20%;
    padding: 20px;

    transition: all 0.2s ease-out;

    &:hover {
        transform: scale(99%);
        background-color: rgba(0, 0, 0, 0.1);
    }

    & > img {
        margin: 0 auto;
    }
`;

const StyledTitleText = styled.div`
    font-family: NanumNeoEB;
    font-size: 30px;
`;

const StyledConText = styled.pre`
    font-family: NanumNeoB;
    font-size: 20px;
`;

export default function Main() {
    const descriptionContent = 
    `     1. 방 만들기 버튼 클릭
     
     2. 축하받을 사람의 생일, 이메일을 적기
     
     3. 생성된 방에서 편지 작성 및 선물 등록하기

     4. 다른 친구에게 링크를 공유하기
    
    당일이 되면 자동으로 메세지 및 선물 확인을 위한 이메일이 전송됩니다.`;
        
    return (
    <PageContainer>
        <TitleWrapper>
            <img alt="MainTitle" width = '600' height = '500' src={ ICON_RESOURCE_PATH + '/Title.png' }/>
        </TitleWrapper>

        <Description>
            <StyledTitleText>The Happy Postbox | 이용방법은 다음과 같습니다.</StyledTitleText>
            <StyledConText>{descriptionContent}</StyledConText>
        </Description>
        
        <LinkWrapper>
            <Link to="/create"><img alt="Button" width = '150' height = '200' src={ ICON_RESOURCE_PATH + '/Button_CreateRoom.png' }/></Link>
        </LinkWrapper>
    </PageContainer>
    );
}