import styled from "@emotion/styled";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from '../components';
import { MessageSendForm, Title2, ItemBox } from "../components/domain";
import PresentSendForm from "../components/domain/PresentSendForm";
import { ItemEventProvider } from "../context/ItemEventProvider";
import { BACKGROUND_PATH } from "../configs/assetConfig";

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
    margin: 0 auto;
    min-height: 720px;
    width: 1200px;
    border-radius: 16px;
    box-shadow: 6.79014px 6.79014px 20.3704px 5.43212px rgba(0, 0, 0, 0.14);
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
    min-width: 125px;
    right: 2%;

    & > * {
        margin-bottom: 24px;
    }

    & img {
        display: block;
        height: 125px;
        width: 125px;
        margin: 0 auto;
        padding: 4px;
        border-radius: 25%;
        cursor: pointer;
        user-select: none;
        object-fit: contain;
        
        :hover {
            background-color: rgba(0, 0, 0, 0.1);
        }
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const ButtonWrapper = styled.div`
    cursor: pointer;
        
    &:hover {
        filter: brightness(90%);
    }
`;

const TooltipWrapper = styled.div`
    position: relative;
`;

const Tooltip = styled.span`
    visibility: hidden;
    opacity: 0;
    width: 120px;
    background-color: rgb(54, 54, 54);
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 4px;
    position: absolute;
    z-index: 1;
    transition: opacity 0.1s ease-in;
    top: -25%;

    &:after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: black transparent transparent transparent;
    }
`;

export default function GiftRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [celebrationVisible, setCelebrationVisible] = useState(false);
    const [messageFormVisible, setMessageFormVisible] = useState(false);
    const [presentFormVisible, setPresentFormVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const tooltipRef = useRef();

    const [roomData, setRoomData] = useState({
        room_name : "",
        room_date : "",
        room_design: "",
        message_design_category: "",
        present_design_category: "",
        messages: [],
        presents: [],
    });

    const displayBoxRef = useRef();

    let timer = null;
    const handleCopyAddress = () => {
        const Tooltip = tooltipRef.current;
        navigator.clipboard.writeText(window.location.href);
        Tooltip.style.visibility = "visible";
        Tooltip.style.opacity = 1;

        clearTimeout(timer);
        timer = setTimeout(() => {
            Tooltip.style.visibility = "hidden";
            Tooltip.style.opacity = 0;
        }, 2000);
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
        const beforeLoading = (roomData) => {
            if (roomData.room_design) {
                displayBoxRef.current.style.backgroundImage = `url(${BACKGROUND_PATH}/${roomData.room_design}.png)`;
            }
            else {
                displayBoxRef.current.style.backgroundImage = `url(${BACKGROUND_PATH}/ROOM_DESIGN_1.png)`;
            }
        }

        const fetchData = async () => {
            try {
                const res = await axios.get(`/room-content`, {
                    params: {
                        room_id: roomId
                    }
                });

                if (res.status === 200) {
                    setRoomData(res.data);
                    beforeLoading(res.data);
                    setLoading(false);
                }
                else {
                    throw new Error('방 정보를 불러올 수 없습니다.');
                }
            } catch (e) {
                alert("허용되지 않은 링크입니다.");
                navigate("/");
            }

        }

        setLoading(true);
        fetchData();
    }, [roomId, navigate]);

    return (
        <ItemEventProvider>
            <PageBackground>
                <ContentContainer>
                    <RoomInfoWrapper>
                        <Title2 />
                        <h2>{!loading && roomData.room_name }<RoomDate>{!loading && calculateDate()}</RoomDate></h2>
                    </RoomInfoWrapper>
                    <DisplayBox ref={displayBoxRef}>
                        {!loading && (
                        <>
                            <ItemBox 
                                width={1200}
                                height={720}
                                style={{ justifyContent: "end" }}
                                messages={roomData.messages}
                                presents={roomData.presents}
                                messageType={roomData.message_design_category}
                                presentType={roomData.present_design_category}
                            />
                        </>
                        )}
                    </DisplayBox>
                </ContentContainer>
                <SideBar>
                    <TooltipWrapper>
                        <img  alt="Button" width = '100' height = '125' onClick={() => handleCopyAddress()} src={ ICON_RESOURCE_PATH + '/Button_CopyLink.png' }/>
                        <Tooltip ref={tooltipRef}>복사되었습니다!</Tooltip>
                    </TooltipWrapper>
                    <img  alt="Button" width = '125' height = '125' onClick={() => setCelebrationVisible(true)} src={ ICON_RESOURCE_PATH + '/Button_congrats.png'}/>
                </SideBar>
                <Modal
                visible={celebrationVisible}
                onClose={() => setCelebrationVisible(false)}
                style={{display: 'flex', justifyContent: 'spaceEvenly', borderRadius: '20px', border: '3px solid #C49DE7', minHeight: '600px', minWidth: '1200px'}}
                    >
                    <ButtonWrapper style={WriteMessageButtonStyle} onClick={() => showMessageForm()} >
                        <img  alt="Button" width = '175' height = '200' src={ ICON_RESOURCE_PATH + '/Button_message.png' }/>
                    </ButtonWrapper>
                    <ButtonWrapper style={WriteMessageButtonStyle} onClick={() => showPresentForm()} >
                        <img  alt="Button" width = '175' height = '200' src={ ICON_RESOURCE_PATH + '/Button_present.png' }/>
                    </ButtonWrapper>
                </Modal>
                <Modal
                    visible={messageFormVisible}
                    onClose={setMessageFormVisible}
                    width='800px'
                    height='900px'
                    style={{ display: 'inline-block', backgroundColor: 'linear-gradient(68deg, #FF62B7 14.39%, #9F53FF 79.59%)', borderRadius: '20px', border: '3px solid #C49DE7'}}
                >
                    <MessageSendForm onSubmit={() => setMessageFormVisible(false)} />
                </Modal>
                <Modal
                    visible={presentFormVisible}
                    onClose={setPresentFormVisible}
                    width='1200px'
                    height='900px'
                    style={{ backgroundColor: 'RGBA(255,246,246, 1)', borderRadius: '20px', border: '3px solid #C49DE7',}}
                >
                    <PresentSendForm onSubmit={() => setPresentFormVisible(false)} />
                </Modal>
            </PageBackground>
        </ItemEventProvider>
    );
}