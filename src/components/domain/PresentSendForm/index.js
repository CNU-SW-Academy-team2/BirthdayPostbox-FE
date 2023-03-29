import { Header, Upload, Text, Spacer, Spinner } from '../..';
import styled from '@emotion/styled';
import useForm from '../../../hooks/useForm';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useRef, useState } from 'react';

const Container = styled.div`
    padding: 8px 64px;
`;

const Form = styled.form`
    display: flex;
    justify-content: space-between;
`;

const Wrapper = styled.div`
    display: inline-block;
`;

const UploadBox = styled.div`
    display: flex;
    height: 699px;
    width: 400px;
    border: 3px dashed #1E77CC;
    font-size: 24px;
    text-align: center;
    justify-content: center;
`;

const TextBox = styled.div`
    width: 400px;
    height: 580px;
    padding: 12px 16px;
    border: 1.5px solid #BD97E0;
    font-size: 16px;
    overflow: auto;

    &:focus {
        outline: 1.5px solid #986bc2;
    }

    &:empty:before {
        content: attr(placeholder);
    }
`;

const SenderInput = styled.input`
    width: 400px;
    height: 1.5em;
    padding: 8px 16px;
    border: 1.5px solid #BD97E0;
    margin-bottom: 12px;
    font-size: 14px;
    &:focus {
        outline: 1.5px solid #986bc2;
    }
`;

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

export default function PresentSendForm({ onSubmit }) {
    const { roomId } = useParams();
    const [sender, setSender] = useState("");
    const contentRef = useRef();
    const uploadImageRef = useRef(null);

    const onDropImage = (changedFile) => {
        let reader = new FileReader();

        reader.readAsDataURL(changedFile);
        reader.onload = () => {
            uploadImageRef.current.src = reader.result;
        }
    };

    const { isLoading, errors, handleChange, handleSubmit, handleChangeCustom } = useForm({
        initialState: {
            sender: "",
            content: ""
        },
        onSubmit: async ({ sender, content, image }) => {
            try {
                // const formData = new FormData();
                // formData.append('room_id', { roomId });
                // formData.append('present_sender', sender);
                // formData.append('present_content', content);
                // formData.append('present_img_url', image);

                // const res = await axios.post('/new-present', formData, {
                //     headers: {
                //         'Content-Type': 'multipart/form-data'
                //     }
                // })
                const jsonData = JSON.stringify({
                    roomDTO: {
                        roomId,
                    },
                    presentSender: sender,
                    presentContent: content,
                    presentImgUrl: "test_img_url",
                });

                const res = await axios.post('/new-present', jsonData, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                
                if (res.status === 200) {
                    setSender("");
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
        validate: ({ sender, content, image }) => {
            const errors = {};
            if (!sender) errors.sender = '작성자 미입력';
            if (!content) errors.content = '내용 미입력';
            // if (!image) errors.image = '이미지 업로드가 되지 않았습니다.';
            return errors;
        }
    });


    return (
        <Container>
            <Header level={2}>선물 등록하기</Header>
            <Form onSubmit={handleSubmit}>
                <Wrapper>
                    <Upload
                    droppable
                    accept="image/*"
                    onChange={(e) => {onDropImage(e);  handleChangeCustom('image', e);}}
                    >
                        { (file, dragging) => 
                        <UploadBox style={{ borderColor: dragging ? '#1E77CC' : '#559ce0'}}>
                            {file ? (
                                    <img
                                        ref={(ref) => {uploadImageRef.current = ref}}
                                        alt=""
                                        style={{
                                            objectFit: 'contain',
                                            maxWidth: '298px',
                                            overflow: 'hidden'
                                        }}
                                    />
                                ) : (
                                    '사진을 업로드 해주세요!'
                                )}
                        </UploadBox>}
                    </Upload>
                </Wrapper>
                <Wrapper>
                     <Text block>작성자</Text>
                    <SenderInput
                        type='text'
                        placeholder="당신은 누구인가요? 물론 밝히지 않아도 괜찮습니다!"
                        name='sender'
                        onChange={(e) => {handleChange(e); setSender(e.target.value)}}
                        value={sender}
                    />
                    <Spacer />
                    <Text block>메시지 남기기</Text>
                    <TextBox
                        placeholder="당신의 마음을 표현해주세요!"
                        contentEditable
                        onInput={(e) => handleChangeCustom('content', e.target.innerHTML)}
                        ref={contentRef}
                    />
                    { isLoading ? <Spinner /> : <SubmitButton>제출하기</SubmitButton>}
                    {errors.content}
                </Wrapper>
            </Form>
        </Container>
    );
}