import styled from "@emotion/styled";

const PageBackground = styled.div`
    height: 100%;
    width: 100%;
    background: linear-gradient( 45deg, #DCF0F8, #F7F0DC, #F3ADCF );
`;

export default function DefaultComponent({ children }) {
    return <PageBackground>{children}</PageBackground>
};