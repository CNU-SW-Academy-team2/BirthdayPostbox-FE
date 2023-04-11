import styled from "@emotion/styled"

const MessageBox = styled.li`
    border: 1px solid blue;
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

const MessageItem = ({ sender, onClick }) => {

    return <MessageBox onClick={onClick}>
        This is Message. <br/><br/>
        Sender: {sender}
    </MessageBox>
}

export default MessageItem;