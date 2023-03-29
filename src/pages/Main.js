import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Text, Icon, Header } from '../components';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const TitleWrapper = styled.div`
    margin: 0 auto;
    text-align: center;
`;
const SubTitle = styled.h2`
    transform: translate(0, -70%);
`;

const Description = styled.div`
    text-align: center;
    margin: 2rem auto 0;
    border: 1px solid #FF62B7;
    box-sizing: border-box;
    border-radius: 8px;
    text-align: left;
    padding: 20px;
    flex-direction: column;
`;

const DescriptionContent = styled.pre`
    left: -10%;
`; 
const LinkWrapper = styled.div`
    margin-top: 6rem;
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
export default function Main() {
    const descriptionContent = `
        1. 방 만들기 버튼 클릭
        2. 생일인 사람의 생일, 이메일을 적기
        3. 생성된 방에서 편지 작성 및 선물 등록하기
        4. 다른 친구에게 링크를 공유하기
        
        생일이 되면 자동으로 메세지 및 선물 확인을 위한 이메일이 전송됩니다.`;
        
    return (
    <PageContainer>
        <TitleWrapper>
            <Header style={{ marginTop: '0px'}}>생일빵</Header>
            <SubTitle>BirthdayPostBox</SubTitle>
        </TitleWrapper>

        <Description>
            <Text block='true' strong='true'>생일빵 : birthday postbox 이용방법은 다음과 같습니다.</Text>
            <DescriptionContent>{descriptionContent}</DescriptionContent>
        </Description>

        <LinkWrapper><Link to="/CreateRoom" style={{ ...LinkStlye }}><Icon name="gift" size={100} style={{}}/>
            <br/>링크 버튼
        </Link></LinkWrapper>
    </PageContainer>
    );
}