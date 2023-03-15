import styled from "@emotion/styled"

const LetterBox = styled.li`
    border: 1px solid blue;
    width: 300px;
    height: 300px;
    list-style: none;
    text-align: left;
    
    :not(:first-of-type) {
        margin-top: 20px;
    }
`;

const LetterItem = ({ id, sender }) => {
    return <LetterBox>
        This is Message. <br/><br/>
        ID: {id} <br />
        Sender: {sender}
    </LetterBox>
}

export default LetterItem;