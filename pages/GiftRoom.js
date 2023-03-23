import styled from "@emotion/styled";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Header, Modal, Upload } from '../components';
import { LetterList, PresentList, MessageSendForm } from "../components/domain";

const PageBackground = styled.div`
    width: 100%;
    height: 100%;
    overflow: auto;
`;

const ContentContainer = styled.div`
    margin: 0 10% 0 10%;
    z-index: 1;
`;

const DisplayBox = styled.div`
    display: flex;
    position: relative;
    min-height: 600px;
    min-width: 80%;
    background-color: white;
    text-align: center;
    border-radius: 16px;
    box-sizing: border-box;
    box-shadow: 6.79014px 6.79014px 20.3704px 5.43212px rgba(0, 0, 0, 0.14);
    justify-content: space-evenly;
`;

const RoomDate = styled.span`
    border: 2px solid gray;
    border-radius: 16px;
    margin-left: 8px;
`;

const SideBar = styled.div`
    position: fixed;
    top: 60%;
    right: 0;
    min-width: 8%;
    margin: 1%;
`;

const Button = styled.button`
    display: block;
    margin: 0 auto;
    background-color: #1fe0;
    border: 1px solid black;

    &:hover {
        cursor: pointer;
    }
    &:not(:first-of-type) {
        margin-top: 10px;
    }
`;

const WriteMessageButtonStyle = {
    minWidth: '20rem',
    minHeight: '20rem',
    margin: 'auto',
    boxSizing: 'border-box',
    border: 'none',
    backgroundColor: '#C49DE7',
    color: 'white',
    fontSize: '25px',
    borderRadius: '44.66px',

    '&:hover': {
        backgroundColor: '#A86DD7'
    }
};

const SenderInput = styled.input`
    width: 99%;
    border: 1.5px solid #BD97E0;

    &:focus {
        outline: 1.5px solid #986bc2;
    }
`;
const TextBox = styled.div`
    min-height: 36vh;
    max-height: 36vh;
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

const UploadBox = styled.div`
    border: 3px dashed #1E77CC;
    height: 450px;
    width: 300px;
    max-width: 500px;
    text-align: center;
    font-size: 1.4rem;
    padding: auto;
`;

export default function GiftRoom() {
    const { roomId } = useParams();
    const [celebrationVisible, setCelebrationVisible] = useState(false);
    const [messageFormVisible, setMessageFormVisible] = useState(false);
    const [presentFormVisible, setPresentFormVisible] = useState(false);
    const uploadImageRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [roomData, setRoomData] = useState({
        room_name : "",
        room_date : "2023-03-22",
        messages: [],
        present: []
    });
    const handleCopyAddress = () => {
        navigator.clipboard.writeText(window.location.href);
        
        alert('복사되었습니다!');
    }

    const showMessageForm = () => {
        setCelebrationVisible(false);
        setMessageFormVisible(true);
    };
    const showPresentForm = () => {
        setCelebrationVisible(false);
        setPresentFormVisible(true);
    };


    const onUploadImage = (changedFile) => {
        let reader = new FileReader();

        reader.readAsDataURL(changedFile);
        reader.onload = () => {
            uploadImageRef.current.src = reader.result;
        }
    };

    const calculateDate = () => {
        const dDay = Math.floor((new Date() - new Date(roomData.room_date)) / (1000 * 60 * 60 * 24));
        return (dDay ? dDay : 'D') + '-Day';
    }
    // 방 정보 api - 서버 접속 오류 해결 시 사용
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`/room-content`, {
                    params: {
                        room_id: roomId
                    }
                });

                if (res.status === 200) {
                    setRoomData(res.data);
                }
                else {
                    throw new Error('방 정보를 불러올 수 없습니다.');
                }
            } catch (e) {
                console.error(e);
            }

        }

        const fetchMessage = async () => {
            try {
                const { data } = await axios.get('/message', {
                    params: {
                        id: "k895f4"
                    }
                });
                console.log(data);

            } catch (e) {
                console.error(e);
            }
        }
        setLoading(true);
        fetchData();
        setLoading(false);
        fetchMessage();
    }, [roomId]);

    return (
        <PageBackground>
            <ContentContainer>
                <h1 style={{ marginTop: '0px'}}>
                    생일빵<br/>
                    Birthday Postbox
                </h1>
                <h2>{!loading && roomData.room_name }<RoomDate>{!loading && calculateDate()}</RoomDate></h2>
                <DisplayBox>
                    {!loading && (
                    <>
                        <PresentList presents={roomData.presents} />
                        <LetterList letters={roomData.messages}/>
                    </>
                    )}
                </DisplayBox>
            </ContentContainer>
            <SideBar>
                <Button onClick={() => handleCopyAddress()}>링크 복사</Button>
                <Button onClick={() => setCelebrationVisible(true)}>축하하기</Button>
            </SideBar>
            <Modal
            visible={celebrationVisible}
            onClose={() => setCelebrationVisible(false)}
            style={{display: 'flex', justifyContent: 'spaceEvenly', borderRadius: '20px', border: '3px solid #C49DE7', minHeight: '600px', minWidth: '1200px', height: '60vh', width: '80vw'}}
                >
                <Button onClick={() => showMessageForm()} style={WriteMessageButtonStyle}>메시지 남기기</Button>
                <Button onClick={() => showPresentForm()} style={WriteMessageButtonStyle}>선물 남기기</Button>
            </Modal>
                <Modal
                visible={messageFormVisible}
                onClose={setMessageFormVisible}
                width='800px'
                height='800px'
                style={{ display: 'inline-block', backgroundColor: 'linear-gradient(68deg, #FF62B7 14.39%, #9F53FF 79.59%)', borderRadius: '20px', border: '3px solid #C49DE7'}}
                >
                    <MessageSendForm onSubmit={() => setMessageFormVisible(false)}/>
                </Modal>
            <Modal
            visible={presentFormVisible}
            onClose={setPresentFormVisible}
            width='1100px'
            style={{ backgroundColor: 'RGBA(255,246,246, 1)', borderRadius: '20px', border: '3px solid #C49DE7', maxWidth: '80vw', maxHeight: '60vh'}}
            >
                <Header level={2}>선물 등록하기</Header>
                <form style={{ display: 'flex', justifyContent: "space-evenly"}}>
                    <div style={{ display: "inline-block"}}>
                        <Upload
                        droppable
                        accept="image/*"
                        onChange={onUploadImage}
                        >
                            { (file, dragging) => 
                            <UploadBox style={{ borderColor: dragging ? '#1E77CC' : '#559ce0'}}>
                                {file ? <img ref={(ref) => {uploadImageRef.current = ref}} alt="" style={{
                                    objectFit: 'fill',
                                    maxWidth: '298px',
                                    overflow: 'hidden'}} /> : 'Browse Files to upload'}
                            </UploadBox>}
                        </Upload>
                    </div>
                    <div style={{ display: "inline-block", height: 'auto'}}>
                        <div>작성자<SenderInput type='text' placeholder="당신은 누구인가요? 물론 밝히지 않아도 괜찮습니다!" /></div>
                        <div style={{marginTop: '20px'}}>메시지 남기기<TextBox placeholder="당신의 마음을 표현해주세요!" contentEditable /></div>
                        <SubmitButton>제출하기</SubmitButton>
                    </div>
                </form>
            </Modal>
        </PageBackground>
    );
}