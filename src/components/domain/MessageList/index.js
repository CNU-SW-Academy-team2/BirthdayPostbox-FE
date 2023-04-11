import MessageItem from "../MessageItem"

const MessageList = ({ messages = [], onClick }) => {

    return (
        <ul>
            {messages.map(({message_id, message_sender}) => 
                <MessageItem
                    key={message_id}
                    sender={message_sender}
                    onClick={onClick && (() => onClick(message_id))}
                />
            )}
        </ul>
    );
}

export default MessageList;

