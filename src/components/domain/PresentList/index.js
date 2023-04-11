import PresentItem from "../PresentItem"
import styled from "@emotion/styled";

const ListContainer = styled.ul`
    padding-left: 0;
`;

const PresentList = ({ presents = [], onClick }) => {

    return (
        <ListContainer>
            {presents.map(({present_id, present_sender}) => 
                <PresentItem
                    key={present_id}
                    sender={present_sender}
                    onClick={onClick && (() => onClick(present_id))}
                />
            )}
        </ListContainer>
    );
}

export default PresentList;