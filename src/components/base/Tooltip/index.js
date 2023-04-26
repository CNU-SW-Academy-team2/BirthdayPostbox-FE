import styled from "@emotion/styled"
import { useRef } from "react";

const Wrapper = styled.div`
    position: relative;
`;

const TooltipText = styled.span`
    visibility: hidden;
    opacity: 0;
    width: 120px;
    background-color: ${({backgroundColor}) => backgroundColor ? backgroundColor : "rgb(54, 54, 54)"};
    color: ${({color}) => color ? color : "#fff"} ;
    text-align: center;
    border-radius: ${({borderRadius}) => borderRadius ? borderRadius + "px" : "6px" };
    padding: 5px 4px;
    position: absolute;
    z-index: 1;
    transition: opacity 0.1s ease-in;
    user-select: none;

    top: ${({offsetY}) => offsetY ? offsetY + "px" : "0px"};
    left: ${({offsetX}) => offsetX ? offsetX + "px" : "0px"};
`;

export default function Tooltip({ children, text, color, backgroundColor, offsetX, offsetY, borderRadius, ...props }) {
    const tooltipRef = useRef();
    const Tooltip = tooltipRef.current;

    const handleMouseEnter = () => {
        Tooltip.style.visibility = "visible";
        Tooltip.style.opacity = 1;
    };
  
    const handleMouseLeave = () => {
        Tooltip.style.visibility = "hidden";
        Tooltip.style.opacity = 0;
    };

    return (
        <Wrapper onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {children}
            <TooltipText ref={tooltipRef} offsetX={offsetX} offsetY={offsetY} color={color} backgroundColor={backgroundColor} borderRadius={borderRadius}>{text}</TooltipText>
        </Wrapper>
    )
}