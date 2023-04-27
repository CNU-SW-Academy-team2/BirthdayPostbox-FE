import { Header, Spacer, Spinner, Text } from '../..';
import styled from '@emotion/styled';
import useForm from '../../../hooks/useForm';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useContext, useRef, useState } from 'react';
import { ItemEventContext } from '../../../context/ItemEventProvider';
import { IDENTIFIERS } from '../../../configs/ItemBoxConstants';

const SubmitButton = styled.button`
    background-color: #C49DE7;
    border: none;
    border-radius: 10px;
    margin: auto auto;
    width : 150px;
    height : 40px;
    font-size : 20px;
    font-family : NanumNeoB;
    
    &:hover {
        cursor: pointer;
        background-color: #986bc2;
    }
`;

const SenderInput = styled.input`
    display: block;
    width: 60%;
    height : 30px;
    border: 1.5px solid #BD97E0;
    margin : auto;
    margin-top : 20px;
    font-size : 18px;
    text-align : center;
    background-color: rgba(255, 255, 255, 0.6);

    &:focus {
        outline: 1.5px solid #986bc2;
        background-color: rgba(255, 255, 255, 1);
    }
`;

const TextBox = styled.div`
    width : 60%;
    height: 400px;
    font-size: 20px;
    margin : auto;
    margin-top : 20px;
    margin-bottom : 20px;
    padding : 10px;
    border: 1.5px solid #BD97E0;
    overflow: auto;
    background-color: rgba(255, 255, 255, 0.6);

    &:focus {
        outline: 1.5px solid #986bc2;
        background-color: rgba(255, 255, 255, 1);
    }
    text-align : center;
 

    &:empty:before {
        content: attr(placeholder);
    }
`;

const ModalBox = styled.div`
    text-align : center;
    height: 100%;
`;

const MessageBox = styled.div`
    background-image: url('${process.env.PUBLIC_URL}/message-design/message2.png');
    background-repeat: no-repeat;
    background-position: top center;
    height : 800px;
`;

const FormBox = styled.div`
    flex-direction : column;
    padding: 110px 0 0 0 ;
`;

const SpinnerWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
`;

export default function MessageSendForm({ onSubmit }) {
    const { roomId } = useParams();
    const [sender, setSender] = useState("");
    const contentRef = useRef();

    const { addItem } = useContext(ItemEventContext);

    const { isLoading, errors, handleChange, handleSubmit, handleChangeCustom } = useForm({
        initialState: {
            sender: "",
            content: ""
        },
        onSubmit: async ({ sender, content }) => {
            try {
                const jsonData = JSON.stringify({
                    messageSender: sender,
                    messageContent: content,
                    messageDesign: "ENVELOPE_1",
                    roomDTO: {
                        roomId
                    }
                })

                const res = await axios.post('/new-message', jsonData, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (res.status === 200) {
                    setSender("");
                    onSubmit && onSubmit(sender);
                    addItem(null, sender, IDENTIFIERS.MESSAGE);
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
        <ModalBox>
                {
                isLoading ? (
                        <SpinnerWrapper>
                            <Spinner size={50}/>
                        </SpinnerWrapper>
                    ) : (
                        <div>
                            <Header level={2} style = {{fontFamily : "NanumNeoB"}}>메시지 작성하기</Header>
                            <MessageBox>
                                <FormBox>
                                    <form onSubmit={handleSubmit}>
                                        <Text style = {{fontFamily : "NanumNeoB", fontSize : "25px"}}>작성자</Text>
                                        <SenderInput
                                            type='text'
                                            placeholder="당신은 누구인가요? 물론 밝히지 않아도 괜찮습니다!"
                                            name='sender'
                                            onChange={(e) => {handleChange(e); setSender(e.target.value)}}
                                            value={sender}
                                            style = {{fontFamily : "NanumNeoB"}}
                                        />
                                        <Spacer />
                                        <Text block style = {{fontFamily : "NanumNeoB", fontSize : "25px"}}>메시지 남기기</Text>
                                        <TextBox
                                            placeholder="당신의 마음을 표현해주세요!"
                                            contentEditable
                                            onInput={(e) => handleChangeCustom('content', e.target.innerHTML)}
                                            ref={contentRef}
                                            style = {{fontFamily : "NanumNeoB"}}
                                        />
                                        <SubmitButton>제출하기</SubmitButton>
                                    </form>
                                </FormBox>
                            </MessageBox>
                        </div>
                    )
                }
        </ModalBox>
    );
}