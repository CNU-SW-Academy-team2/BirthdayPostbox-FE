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
`;

const PresentItem = ({ id, sender }) => {
    return (
    <PresentBox>
        This is Present. <br/><br/>
        ID: {id} <br />
        Sender: {sender}
    </PresentBox>
    );
}

export default PresentItem;

