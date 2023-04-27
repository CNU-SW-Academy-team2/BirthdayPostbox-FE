import { Header, Upload, Text, Spacer, Spinner } from '../..';
import styled from '@emotion/styled';
import useForm from '../../../hooks/useForm';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useContext, useRef, useState } from 'react';
import { ItemEventContext } from '../../../context/ItemEventProvider';
import { IDENTIFIERS } from '../../../configs/ItemBoxConstants';

const Container = styled.div`
    padding: 8px 64px;
    height: 100%;
`;

const Form = styled.form`
    display: flex;
    justify-content: space-between;
`;

const Wrapper = styled.div`
`;

const MessageBox = styled.div`
    background-image: url('${process.env.PUBLIC_URL}/message-design/message2.png');
    background-repeat: no-repeat;
    background-position: top center;
    width : 500px;
    padding : 20px;
    padding-top : 110px;
    text-align : center;
`;

const UploadBox = styled.div`
    height: 599px;
    width: 400px;
    border: 3px dashed #1E77CC;
    font-size: 24px;
    text-align: center;
    font-family : NanumNeoB;
    color : grey;
    padding-top : 20px;
    justify-content: center;
    border-color: #BD97E0;
    background-color : white;
    border-radius : 20px;
`;

const TextBox = styled.div`
    width: 400px;
    height: 400px;
    border: 1.5px solid #BD97E0;
    font-size: 20px;
    padding: 8px;
    overflow: auto;
    margin : auto;
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
    padding: 4px 16px;
    margin-top : 6px;
    border: 1.5px solid #BD97E0;
    margin-bottom: 20px;
    font-size: 18px;
    text-align : center;
    &:focus {
        outline: 1.5px solid #986bc2;
    }
`;

const SubmitButton = styled.button`
    background-color: #C49DE7;
    border: none;
    border-radius: 10px;
    margin-top: 30px;
    width : 150px;
    height : 40px;
    font-size : 20px;
    font-family : NanumNeoB;
    
    &:hover {
        cursor: pointer;
        background-color: #986bc2;
    }
`;

const Icon = styled.img`
    display: inline-block;
    width: 100px;
    height: 100px;
    object-fit: contain;
    cursor: pointer;
`;

const IconAnchor = styled.a`
    display: block;
    color: black;
    border: 1px solid black;
    margin-top: 15px;
    text-align: center;
    background-color : white;
    border-radius : 20px;
    border: 3px dashed #1E77CC;
    border-color: #BD97E0;
    `;

const SpinnerWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
`;

export default function PresentSendForm({ onSubmit }) {
    const { roomId } = useParams();
    const [sender, setSender] = useState("");
    const contentRef = useRef();
    const uploadImageRef = useRef(null);
    const { addItem } = useContext(ItemEventContext);
    
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
                const formData = new FormData();
                formData.append('roomDTO.roomId', roomId );
                formData.append('presentSender', sender);
                formData.append('presentContent', content);
                formData.append('image', image);
                formData.append('presentDesign', "GIFT_BOX_1");

                const res = await axios.post('/new-present', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })

                if (res.status === 200) {
                    setSender("");
                    onSubmit && onSubmit();
                    addItem(null, sender, IDENTIFIERS.PRESENT);
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
            {
                isLoading ? (
                    <SpinnerWrapper>
                        <Spinner size={50} />
                    </SpinnerWrapper>
                ) : (
                    <div>
                        <Form onSubmit={handleSubmit}>
                            <Wrapper>
                            <Header level={1} style = {{fontFamily : "NanumNeoB"}}>선물 등록하기</Header>
                                <Upload
                                droppable
                                accept="image/*"
                                onChange={(e) => {onDropImage(e);  handleChangeCustom('image', e);}}
                                >
                                    { (file, dragging) => 
                                    <UploadBox>
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
                                <IconAnchor href='https://gift.kakao.com/home' target='_black'>
                                    <img style={{width : '300px', height : '70px', marginTop : '8px'}} alt='카카오톡 링크' src={process.env.PUBLIC_URL + "/icon/kakao_shopping2.png"} />
                                    <br/>
                                    <div style={{ display: "inline-block", fontFamily : "NanumNeoB", fontSize : "18px", marginTop : '8px', marginBottom : '8px'}}>기프티콘은 어떠세요?</div>
                                </IconAnchor>
                            </Wrapper>
                            <MessageBox>
                                <Wrapper>
                                    <Text block style={{fontFamily : "NanumNeoB", fontSize: "25px",marginBottom : "8px"}}>작성자</Text>
                                    <SenderInput
                                        type='text'
                                        placeholder="당신은 누구인가요? 물론 밝히지 않아도 괜찮습니다!"
                                        name='sender'
                                        onChange={(e) => {handleChange(e); setSender(e.target.value)}}
                                        value={sender}
                                    />
                                    <Spacer />
                                    <Text block style={{fontFamily : "NanumNeoB", fontSize: "25px",marginBottom : "20px"}}>메시지 남기기</Text>
                                    <TextBox
                                        placeholder="당신의 마음을 표현해주세요!"
                                        contentEditable
                                        onInput={(e) => handleChangeCustom('content', e.target.innerHTML)}
                                        ref={contentRef}
                                    />
                                    <SubmitButton>제출하기</SubmitButton>
                                </Wrapper>
                            </MessageBox>
                        </Form>
                    </div>
                )
            }

        </Container>
    );
}