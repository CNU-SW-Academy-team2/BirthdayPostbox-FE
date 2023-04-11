import styled from "@emotion/styled";

const PresentBox = styled.li`
    border: 1px solid red;
    width: 300px;
    height: 300px;
    list-style: none;
    text-align: left;
    
    :not(:first-of-type) {
        margin-top: 20px;
    }

    &:hover {
        cursor: ${({onClick}) => onClick && "pointer"}
    }
`;

const PresentItem = ({ sender, onClick }) => {

    return (
        <PresentBox onClick={onClick}>
            This is Present. <br/><br/>
            Sender: {sender}
        </PresentBox>
    );
}

export default PresentItem;

