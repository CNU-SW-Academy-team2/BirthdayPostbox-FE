import styled from "@emotion/styled";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal } from '../components';
import { MessageSendForm, Title2, ItemBox } from "../components/domain";
import PresentSendForm from "../components/domain/PresentSendForm";
import { ItemEventProvider } from "../context/ItemEventProvider";

const ICON_RESOURCE_PATH = process.env.PUBLIC_URL + "/icon";

const PageBackground = styled.div`
    width: 100%;
    height: 100%;
    overflow: auto;
`;

const ContentContainer = styled.div`
`;

const RoomInfoWrapper = styled.div`
    margin: 0 auto;
    width: 1200px;
`;

const DisplayBox = styled.div`
    display: flex;
    margin: 0 auto;
    min-height: 600px;
    width: 1200px;
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

    & > img {
        display: block;
        margin: 0 auto;
        cursor: pointer;
        user-select: none;

        :not(:first-of-type) {
            margin-top: 16px;
        }
    }
`;

const Button = styled.button`
    display: block;
    margin: 0 auto;
    background-color: #1fe0;
    border: 2px solid #D47DC7;
    border-radius: 10%;

    &:hover {
        cursor: pointer;
    }
    &:not(:first-of-type) {
        margin-top: 40px;
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

export default function GiftRoom() {
    const { roomId } = useParams();
    const [celebrationVisible, setCelebrationVisible] = useState(false);
    const [messageFormVisible, setMessageFormVisible] = useState(false);
    const [presentFormVisible, setPresentFormVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [roomData, setRoomData] = useState({
        room_name : "",
        room_date : "",
        messages: [],
        presents: []
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

    const calculateDate = () => {
        if (!roomData.room_date) {
            return "";
        }

        const today = new Date();
        const birthdayDate = new Date(roomData.room_date);

        if (birthdayDate.getMonth() < today.getMonth() ||
            (birthdayDate.getMonth() === today.getMonth() && birthdayDate.getDate() <= today.getDate())
        ) {
            birthdayDate.setFullYear(today.getFullYear() + 1);
        }
        else {
            birthdayDate.setFullYear(today.getFullYear());
        }

        const diff = birthdayDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return (daysLeft ? daysLeft : 'D') + '-Day';
    }

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
                    setLoading(false);
                }
                else {
                    throw new Error('방 정보를 불러올 수 없습니다.');
                }
            } catch (e) {
                console.error(e);
            }

        }

        setLoading(true);
        fetchData();
    }, [roomId]);

    return (
        <ItemEventProvider>
            <PageBackground>
                <ContentContainer>
                    <RoomInfoWrapper>
                        <Title2 />
                        <h2>{!loading && roomData.room_name }<RoomDate>{!loading && calculateDate()}</RoomDate></h2>
                    </RoomInfoWrapper>
                    <DisplayBox>
                        {!loading && (
                        <>
                            <ItemBox 
                                width={1200}
                                height={720}
                                style={{ justifyContent: "end" }}
                                messages={roomData.messages}
                                presents={roomData.presents}
                            />
                        </>
                        )}
                    </DisplayBox>
                </ContentContainer>
                <SideBar>
                    <img  alt="Button" width = '100' height = '125' onClick={() => handleCopyAddress()} src={ ICON_RESOURCE_PATH + '/Button_CopyLink.png' }/>
                    <img  alt="Button" width = '125' height = '125' onClick={() => setCelebrationVisible(true)} src={ ICON_RESOURCE_PATH + '/Button_congrats.png'}/>
                </SideBar>
                <Modal
                visible={celebrationVisible}
                onClose={() => setCelebrationVisible(false)}
                style={{display: 'flex', justifyContent: 'spaceEvenly', borderRadius: '20px', border: '3px solid #C49DE7', minHeight: '600px', minWidth: '1200px'}}
                    >
                    <Button onClick={showMessageForm} style={WriteMessageButtonStyle}>메시지 남기기</Button>
                    <Button onClick={showPresentForm} style={WriteMessageButtonStyle}>선물 남기기</Button>
                </Modal>
                <Modal
                    visible={messageFormVisible}
                    onClose={setMessageFormVisible}
                    width='800px'
                    height='800px'
                    style={{ display: 'inline-block', backgroundColor: 'linear-gradient(68deg, #FF62B7 14.39%, #9F53FF 79.59%)', borderRadius: '20px', border: '3px solid #C49DE7'}}
                >
                    <MessageSendForm onSubmit={(sender) => {
                        
                        setMessageFormVisible(false);
                    }} />
                </Modal>
                <Modal
                    visible={presentFormVisible}
                    onClose={setPresentFormVisible}
                    width='1200px'
                    style={{ backgroundColor: 'RGBA(255,246,246, 1)', borderRadius: '20px', border: '3px solid #C49DE7',}}
                >
                    <PresentSendForm onSubmit={() => setPresentFormVisible(false)} />
                </Modal>
            </PageBackground>
        </ItemEventProvider>
    );
}