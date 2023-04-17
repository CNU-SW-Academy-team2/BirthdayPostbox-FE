import styled from '@emotion/styled';

const Image = styled.img`
    user-select: none;
`;

export function Title2() {
    return <Image alt="MainTitle" width = '350' height = '125' src={process.env.PUBLIC_URL + '/icon/Title2.png'}/>;
}