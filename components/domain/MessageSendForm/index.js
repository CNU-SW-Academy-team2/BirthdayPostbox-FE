import { Header, Spacer, Spinner, Text } from '../..';
import styled from '@emotion/styled';
import useForm from '../../../hooks/useForm';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useRef } from 'react';

const SubmitButton = styled.button`
    background-color: #C49DE7;
    border: none;
    border-radius: 2px;
    margin: auto auto;
    
    &:hover {
        cursor: pointer;
        background-color: #986bc2;
    }
`;

const SenderInput = styled.input`
    display: block;
    width: 99%;
    border: 1.5px solid #BD97E0;

    &:focus {
        outline: 1.5px solid #986bc2;
    }
`;

const TextBox = styled.div`
    height: 60vh;
    font-size: 13px;
    border: 1.5px solid #BD97E0;
    overflow: auto;
    &:focus {
        outline: 1.5px solid #986bc2;
    }

    &:empty:before {
        content: attr(placeholder);
    }
`;

export default function MessageSendForm({ onSubmit }) {
    const { roomId } = useParams();
    const senderRef = useRef();
    const contentRef = useRef();

    const { isLoading, errors, handleChange, handleSubmit, handleChangeByContentEditable } = useForm({
        initialState: {
            sender: "",
            content: ""
        },
        onSubmit: async ({ sender, content }) => {  // 현재 400 error 발생
            try {
                const res = await axios.post('/new-message', null, {
                    'Content-Type': 'application/json',
                    params: {
                        messageSender: JSON.stringify(sender),
                        messageContent: JSON.stringify(content),
                        roomDTO: {
                            roomId: roomId
                        }
                    }
                });

                if (res.status === 200) {
                    senderRef.current.value = "";
                    contentRef.current.innerHTML = "";
                    onSubmit && onSubmit();
                }
                else {
                    throw new Error(`메시지 전송 오류 Status ${res.status}`);
                }
            } catch (e) {
                console.error(e);
            }
        },
        validate: ({ sender, content }) => {
            const errors = {};
            if (!sender) errors.sender = '작성자 미입력';
            if (!content) errors.content = '내용 미입력';
            return errors;
        }
    });

    return (
        <div>
                <Header level={2}>메시지 작성하기</Header>
                <form onSubmit={handleSubmit}>
                    <Text>작성자</Text>
                    <SenderInput
                        type='text'
                        placeholder="당신은 누구인가요? 물론 밝히지 않아도 괜찮습니다!"
                        name='sender'
                        onChange={handleChange}
                        ref={senderRef}
                    />
                    <Spacer />
                    <Text block>메시지 남기기</Text>
                    <TextBox
                        placeholder="당신의 마음을 표현해주세요!"
                        contentEditable
                        onInput={(e) => handleChangeByContentEditable(e, 'content')}
                        ref={senderRef}
                    />
                    { isLoading ? <Spinner /> : <SubmitButton>제출하기</SubmitButton>}
                    {errors.content}
                </form>
        </div>
    );
}