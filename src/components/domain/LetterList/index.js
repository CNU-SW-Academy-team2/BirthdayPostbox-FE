import styled from "@emotion/styled";
import LetterItem from "../LetterItem"


const ListContainer = styled.ul`
    padding-left: 0;
`;

const LetterList = ({ letters = [] }) => {
    return (
        <ListContainer>
            {letters.map(({message_id, message_sender}) => 
                <LetterItem
                    key={message_id}
                    id={message_id}
                    sender={message_sender}
                />
            )}
        </ListContainer>
    );
}

export default LetterList;

