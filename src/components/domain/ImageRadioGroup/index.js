import styled from "@emotion/styled";

const ImageRadioContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const Label = styled.label`
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 16px;
    box-sizing: border-box;
    margin: 0px 24px;
    transition: background-color 0.2s ease-out,
                filter 0.2s ease-out,
                box-shadow 0.2s ease-out;

    &:hover {
        filter: brightness(90%);
        background-color: rgba(0, 0, 0, 0.1);
    }

    &:active {
        filter: brightness(80%);
        background-color: rgba(0, 0, 0, 0.2);
    }

    &:has(input:checked) {
        box-shadow: 0 0 15px #1E90FF;
    }

`;

const Radio = styled.input`
    display: none;
`;

const Image = styled.img`
    padding: "4px 8px";
    max-width: calc(100% - 16px);
    max-height: calc(100% - 8px);
`;

export default function ImageRadioGroup({
    list = [],
    name,
    block = false,
    objectFit = "contain",
    width = 160,
    height = 90,
    onChange,
    ...props
}) {
    const labelStyle = {
        display: block ? "block" : "inline-block",
        width: width + "px",
        height: height + "px",
    }

    const imgStyle = {
        objectFit,

    }


    return (
        <ImageRadioContainer>
            {
                list.map(({ src, alt = "Image loading Error", value })=> (
                    <Label key={value} style={labelStyle}>
                        <Radio type="radio" value={value} name={name} onChange={onChange}/>
                        <Image src={src} alt={alt} style={imgStyle} />
                    </Label>
                ))
            }
        </ImageRadioContainer>
    );
}