import styled from "@emotion/styled";
import LetterItem from "../LetterItem"


const ListContainer = styled.ul`
    padding-left: 0;
`;

const LetterList = () => {
    return (
        <ListContainer>
            {DUMMY.map(({message_id, message_sender}) => 
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

const DUMMY = [
        {
            "message_id": "JD8DG5",
            "message_sender": "김보리"
        },
        {
            "message_id": "JD8D66",
            "message_sender": "박수강"
        }
];