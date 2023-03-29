import styled from "@emotion/styled";

const PageBackground = styled.div`
    width: 100%;
    height: 100%;
    background: linear-gradient( 45deg, #DCF0F8, #F7F0DC, #F3ADCF );
`;

export default function DefaultComponent({ children }) {
    return <PageBackground>{children}</PageBackground>
};