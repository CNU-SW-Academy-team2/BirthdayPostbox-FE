import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import { createTheme } from "@mui/material/styles";
import axios from "axios";
import { Spacer, Spinner } from "../components";
import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { ImageRadioGroup, Title2, ItemBox } from "../components/domain";
import { ItemEventProvider } from "../context/ItemEventProvider";
import { BACKGROUND_PATH, CAKE_PATH, CHOCOLATE_PATH, ENVELOPE_PATH, GIFTBOX_PATH, TAFFY_PATH } from "../configs/assetConfig";

const PageWrapper = styled.div`
    padding-bottom: 128px;
`;

const PreviewBackground = styled.div`
    height: 720px;
`;

const FormBox = styled.form`
    display: flex;
    width: 1600px;
    margin: 0 auto;
    padding: 8px 16px;
    background-color: white;
    text-align: center;
    justify-content: center;
    border-radius: 16px;

    box-sizing: border-box;
    box-shadow: 6.79014px 6.79014px 20.3704px 5.43212px rgba(0, 0, 0, 0.14);
`;

const InputWrapper = styled.div`
    position: relative;
    margin-top: 30px;
`;

const Input = styled.input`
    border: 0px;
    border-bottom: 0.5px solid black;
    
    &:focus {
        outline: none;
    }

`;

const StyledInput = styled.input`
  padding: 0.5em;
  border-radius: 8px;
  border: none;
  outline: none;
  font-size: 1.2rem;
  background-color: #f2f2f2;
  color: #333;
  text-align: center;

  // input date를 위한 css 요소 이후에 다른 형식으로 변경되면 삭제
  ::-webkit-calendar-picker-indicator {
    margin-right: 0.5rem;
  }
`;

const ErrorMessage = styled.div`
    position: absolute;
    color: red;
    left: 50%;
    transform: translate(-50%, 0);
    white-space: nowrap;
`;

const TitleWrapper = styled.div`
    padding: 20px;
    margin-left : 60px;
`;

const StyledTitle = styled.div`
    font-family: NanumNeoEB;
    font-size: 35px;
    margin: 20px;
`;

const StyledSubTitle = styled.div`
    font-family: NanumNeoB;
    font-size: 25px;
    margin: 35px;
`;

const ButtonTheme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#ffcdd2",
    }
  }
});

const PreviewInfo = styled.div`
    display: flex;
    justify-content: left;
    flex-direction: column;
    text-align: left;
    background-color: white;
    & > * {
        display: block;
        flex-basis: 100%;
        margin-left: 48px;
    }
`;

export default function CreateRoom() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [minDate, setMinDate] = useState(); 
    const [maxDate, setMaxDate] = useState(); 
    const [page, setPage] = useState(0);

    const [roomName, setRoomName] = useState("");
    const [date, setDate] = useState("");
    const [email, setEmail] = useState("");
    const [backgroundStyle, setBackgroundStyle] = useState(null);
    const [messageStyle, setMessageStyle] = useState(null);
    const [presentStyle, setPresentStyle] = useState(null);

    const [previewMessages, setPreviewMessages] = useState([]);
    const [previewPresents, setPreviewPresents] = useState([]);

    useEffect(() => {
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        setMaxDate(maxDate.toISOString().slice(0, 10));

        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 1);
        setMinDate(minDate.toISOString().slice(0, 10));

        const messages = [];
        const presents = [];
        for (let i = 0; i < 10; i++) {
            messages.push({ message_id: `m${i}`, message_sender: "" });
            presents.push({ present_id: `p${i}`, present_sender: "" });
        }
        setPreviewMessages(messages);
        setPreviewPresents(presents);
    }, []);

    const { isLoading, handleChange, handleSubmit } = useForm({
        initialState: {},
        onSubmit: async () => {
            try {
                const res = await axios.post("/new-room", null, {
                    params: {
                        roomName: roomName,
                        roomBirthdate: date,
                        roomEmail: email,
                        roomDesign: backgroundStyle,
                        messageDesignCategory: messageStyle,
                        presentDesignCategory: presentStyle,
                    }
                });

                if (res.status === 200) {
                    navigate(`/gift/${res.data}`);
                }

                throw new Error(`방 생성 API 전송 오류`);   // 방 5회 이상 생겼을 경우
            } catch (e) {
                setErrorMessage("해당 이메일로 더 이상 방을 생성할 수 없습니다.");
                setPage(0);
            }
        },
        validate: () => {
            const errors = {};
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) errors.roomEmail = "이메일 형식이 올바르지 않습니다.";
            if (!roomName) errors.roomName = "방 이름을 입력해주세요.";
            if (!date) errors.roomBirthdate = "생일을 입력해주세요.";
            if (!backgroundStyle) errors.backgroundStyle = "배경을 선택해주세요";
            if (!messageStyle) errors.messageStyle = "메시지을 선해주세요.";
            if (!presentStyle) errors.presentStyle = "선물을 선택해주세요.";

            return errors;
        }
    });

    const handleCheckPage0 = () => {
        setErrorMessage({});
        const errors = {};

        if (!roomName) errors.roomName = "방 이름을 입력해주세요.";
        if (!date) errors.roomBirthdate = "생일을 입력해주세요.";
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) errors.roomEmail = "이메일 형식이 올바르지 않습니다.";

        if (Object.keys(errors).length === 0) {
            setPage(1);
        }
        setErrorMessage(errors);
    }

    const handleCheckPage1 = () => {
        setErrorMessage({});
        const errors = {};

        if (!backgroundStyle) errors.backgroundStyle = "배경을 선택해주세요.";
        if (!messageStyle) errors.messageStyle = "메시지을 선택해주세요.";
        if (!presentStyle) errors.presentStyle = "선물을 선택해주세요.";
        
        if (Object.keys(errors).length === 0) {
            setPage(2);
        }
        setErrorMessage(errors);
    }

    const handleChangeBackground = (e) => {
        handleChange(e);
        setBackgroundStyle(e.target.value);
    }
    const handleChangeMessage = (e) => {
        handleChange(e);
        setMessageStyle(e.target.value);
    }
    const handleChangePresent = (e) => {
        handleChange(e);
        setPresentStyle(e.target.value);
    }
    return (
        <PageWrapper>
            <TitleWrapper>
                <Title2 />
            </TitleWrapper>
            <FormBox onSubmit={handleSubmit}>
                <Spacer type="vertical">
                    <div style={{ display: page === 0 ? "block" : "none" }}>
                        <StyledTitle>새로운 방 생성하기</StyledTitle>
                        <InputWrapper>
                            <StyledSubTitle>방 이름</StyledSubTitle>
                            <Input
                                name="roomName"
                                type="text"
                                placeholder="방 이름을 입력해주세요."
                                onChange={(e) => { handleChange(e); setRoomName(e.target.value) }}
                                maxlength = "10"
                                style={{width:200, height:30, fontSize: 20}}
                            />
                            <ErrorMessage>{errorMessage.roomName}</ErrorMessage>
                        </InputWrapper>
                        <InputWrapper>
                            <StyledSubTitle>축하받을 날을 지정해주세요.</StyledSubTitle>
                            <StyledInput
                                name="roomBirthdate"
                                type="date"
                                min={minDate}
                                max={maxDate}
                                onChange={(e) => { handleChange(e); setDate(e.target.value) }}
                            />
                            <ErrorMessage>{errorMessage.roomBirthdate}</ErrorMessage>
                        </InputWrapper>
                        <InputWrapper>
                            <StyledSubTitle>이메일을 입력해주세요. </StyledSubTitle>
                            <Input
                                name="roomEmail"
                                type="email"
                                label="선물을 받는 사람의 이메일을 입력해주세요."
                                placeholder="선물을 받는 사람의 이메일을 입력해주세요."
                                onChange={(e) => { handleChange(e); setEmail(e.target.value) }}
                                style={{width:400, height:30, fontSize: 20}}
                            />
                            <ErrorMessage>{errorMessage.roomEmail}</ErrorMessage>
                        </InputWrapper>
                        <InputWrapper>
                            <Button variant="contained" type="button" theme={ButtonTheme} sx={{ width: 200, padding: 1, margin: 2, fontSize: 20}} disabled={isLoading} onClick={handleCheckPage0}>다음으로</Button>
                        </InputWrapper>
                    </div>
                    <div style={{ display: page === 1 ? "block" : "none" }}>
                        <StyledTitle>방 디자인 선택하기</StyledTitle>
                        <InputWrapper>
                            <StyledSubTitle>배경 선택</StyledSubTitle>
                            <ImageRadioGroup list={BACKGROUNDS} name="background" onChange={handleChangeBackground} />
                            <ErrorMessage>{errorMessage.backgroundStyle}</ErrorMessage>
                        </InputWrapper>
                        <InputWrapper>
                            <StyledSubTitle>메시지 선택</StyledSubTitle>
                            <ImageRadioGroup list={MESSAGES} name="message" onChange={handleChangeMessage}/>
                            <ErrorMessage>{errorMessage.messageStyle}</ErrorMessage>
                        </InputWrapper>
                        <InputWrapper>
                            <StyledSubTitle>선물 선택</StyledSubTitle>
                            <ImageRadioGroup list={PRESENTS} name="present" onChange={handleChangePresent} />
                            <ErrorMessage>{errorMessage.presentStyle}</ErrorMessage>
                        </InputWrapper>
                        <InputWrapper>
                            <Button variant="contained" type="button" theme={ButtonTheme} sx={{ width: 200, padding: 1, margin: 2, fontSize: 20}} disabled={isLoading} onClick={handleCheckPage1}>다음으로</Button>
                        </InputWrapper>
                    </div>
                    <div style={{ display: page === 2 ? "block" : "none" }}>
                        <StyledTitle>방 정보</StyledTitle>
                        <div>
                        
                            <PreviewBackground style={{ display: 'block', objectFit: "contain", width: 1080, height: 900, margin: '0 auto'}}>
                                <PreviewInfo style={{ display: 'flex', justifyContent: 'left' }}>
                                    <h2>방 이름: {roomName}</h2>
                                    <h2>이메일 {email}</h2>
                                    <h2>날짜: {date}</h2>
                                </PreviewInfo>
                                <div>
                                    <div style={{ width: 1000, height: 600, margin: "0 auto", backgroundImage: `url(${BACKGROUND_PATH}/${backgroundStyle}.png)` }}>
                                        {
                                            page === 2 ? (
                                                <ItemEventProvider>
                                                    <ItemBox 
                                                        width={1000}
                                                        height={600}
                                                        scale={1}
                                                        style={{ justifyContent: "end" }}
                                                        messages={previewMessages}
                                                        presents={previewPresents}
                                                        messageType={messageStyle}
                                                        presentType={presentStyle}
                                                    />
                                                </ItemEventProvider>
                                            ) : (
                                                <div />
                                            )
                                        }
                                    </div>
                                </div>
                            </PreviewBackground>
                        </div>
                        <Button variant="contained" type="submit" theme={ButtonTheme} sx={{ width: 200, padding: 1, margin: 2, fontSize: 20 }} disabled={isLoading && (page === 2)} onClick={handleCheckPage1} > {isLoading ? <Spinner /> : "방 생성하기" }</Button>
                    </div>
                </Spacer>
            </FormBox>
        </PageWrapper>
    );
}

const BACKGROUNDS = [
    {
      src: BACKGROUND_PATH + "/ROOM_DESIGN_1.png",
      alt: "ROOM_DESIGN_1",
      value: "ROOM_DESIGN_1"
    },
    {
      src: BACKGROUND_PATH + "/ROOM_DESIGN_2.png",
      alt: "ROOM_DESIGN_2",
      value: "ROOM_DESIGN_2"
    },
    {
      src: BACKGROUND_PATH + "/ROOM_DESIGN_3.png",
      alt: "ROOM_DESIGN_3",
      value: "ROOM_DESIGN_3"
    },
    {
      src: BACKGROUND_PATH + "/ROOM_DESIGN_4.png",
      alt: "ROOM_DESIGN_4",
      value: "ROOM_DESIGN_4"
    },
    {
      src: BACKGROUND_PATH + "/ROOM_DESIGN_5.png",
      alt: "ROOM_DESIGN_5",
      value: "ROOM_DESIGN_5"
    },
];

const MESSAGES = [
    {
        src: ENVELOPE_PATH + "/envelope1.png",
        alt: "envelope",
        value: "ENVELOPE"
    },
    {
        src: CAKE_PATH + "/strawberries1.png",
        alt: "cake",
        value: "CAKE"
    }
];

const PRESENTS = [
    {
        src: CHOCOLATE_PATH + "/chocolate1.png",
        alt: "chocolate",
        value: "CHOCOLATE"
    },
    {
        src: GIFTBOX_PATH + "/giftbox_1.png",
        alt: "giftbox",
        value: "GIFT_BOX"
    },
    {
        src: TAFFY_PATH + "/taffy1.png",
        alt: "taffy",
        value: "TAFFY"
    },
];