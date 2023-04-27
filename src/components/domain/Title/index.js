import styled from '@emotion/styled';

const Image = styled.img`
    user-select: none;
    margin-top: 20px;
`;

export function Title2() {
    return <Image alt="MainTitle" width = '300' height = '125' src={process.env.PUBLIC_URL + '/icon/Title2.png'}/>;
}