import styled from "@emotion/styled";
import useToggle from "../../../hooks/useToggle";

const ToggleContainer = styled.label`
    display: inline-block;
    cursor: pointer;
    user-select: none;
`;

const ToggleSwitch = styled.div`
    width: 64px;
    height: 30px;
    padding: 2px;
    border-radius: 15px;
    background-color: #ccc;
    transition: background-color 1s ease-out;
    box-sizing: border-box;

    &:after {
        content: '';
        position: relative;
        left: 0;
        display: block;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background-color: white;
        transition: left 1s ease-out;
    }
`;

const ToggleInput = styled.input`
    display: none;

    &:checked + div {
        background: lightgreen;
    }

    &:checked + div:after {
        left: calc(100% - 26px);
    }

    &:disabled + div {
        opacity: 0.7;
        cursor: not-allowed;

        &:after {
            opacity: 0.7;
        }
    }
`;
export default function Toggle({
    name,
    on = false,
    disabled,
    onChange,
    ...props
}) {
    const [checked, toggle] = useToggle(on);

    const handleChange = (e) => {
        toggle();
        onChange && onChange();
    }

    return (
        <ToggleContainer {...props}>
            <ToggleInput type="checkbox" name={name} checked={checked} disabled={disabled} onChange={handleChange} style={{display: 'none'}}></ToggleInput>
            <ToggleSwitch></ToggleSwitch>
        </ToggleContainer>
    );
}