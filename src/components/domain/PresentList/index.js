import PresentItem from "../PresentItem"
import styled from "@emotion/styled";

const ListContainer = styled.ul`
    padding-left: 0;
`;

const PresentList = ({ presents = [] }) => {
    return (
        <ListContainer>
            {presents.map(({present_id, present_sender}) => 
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