import PresentItem from "../PresentItem"
import styled from "@emotion/styled";

const ListContainer = styled.ul`
    padding-left: 0;
`;

const PresentList = () => {
    return (
        <ListContainer>
            {DUMMY.map(({present_id, present_sender}) => 
                <PresentItem
                    key={present_id}
                    id={present_id}
                    sender={present_sender}
                />
            )}
        </ListContainer>
    );
}

export default PresentList;

const DUMMY = [
            {
                "present_id": "JD8DG5",
                "present_sender": "김보리"
            },
            {
                "present_id": "JD8D66",
                "present_sender": "박수강"
            },
            {
                "present_id": "JD8D67",
                "present_sender": "가나다"
            },
];

