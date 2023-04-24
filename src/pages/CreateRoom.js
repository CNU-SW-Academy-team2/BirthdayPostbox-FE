import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import { createTheme } from "@mui/material/styles";
import axios from "axios";
import { Spacer, Spinner } from "../components";
import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { ImageRadioGroup, Title2 } from "../components/domain";

const PageWrapper = styled.div`
`;

const FormBox = styled.form`
    position: flex;
    width: 80%;
    margin: 0 10%;
    padding: 8px 16px;
    background-color: white;
    text-align: center;
    border-radius: 16px;

    box-sizing: border-box;
    box-shadow: 6.79014px 6.79014px 20.3704px 5.43212px rgba(0, 0, 0, 0.14);
`;

const InputWrapper = styled.div`
    margin-top: 30px;
`;

const Input = styled.input`
    border: 0px;
    border-bottom: 0.5px solid black;

    &:focus {
        outline: none;
    }

`;
const LinkButton = styled.button`
    background-color: #FFE2EA;
    border-radius: 4px;
    border: 0px;
    padding: 10px;
    width: 200px;
    height: 80px;
    font-size: 20px;
    font-weight: bold;

    &:hover {
        cursor: pointer
    }
`

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
    color: red;
`;

const TitleWrapper = styled.div`
    padding: 20px;
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

const ListDisplayer = styled.div`
    display: flex;

`;

const ButtonTheme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#ffcdd2",
    }
  }
});


export default function CreateRoom() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [minDate, setMinDate] = useState(); 
    const [maxDate, setMaxDate] = useState(); 
    const [page, setPage] = useState(0);

    const [backgroundStyle, setBackgroundStyle] = useState(null);
    const [messageStyle, setMessageStyle] = useState(null);
    const [presentStyle, setPresentStyle] = useState(null);

    useEffect(() => {
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        setMaxDate(maxDate.toISOString().slice(0, 10));

        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 1);
        setMinDate(minDate.toISOString().slice(0, 10));

    }, []);

    const { values, isLoading, errors, handleChange, handleSubmit } = useForm({
        initialState: {
            roomName: "",
            roomBirthdate: "",
            roomEmail: "",
            background: "",
            presnet: "",
            message: ""
        },
        onSubmit: async ({ roomName, roomBirthdate, roomEmail }) => {
            try {
                const res = await axios.post("/new-room", null, {
                    params: {
                        roomName,
                        roomBirthdate,
                        roomEmail,
                        roomCategory: "BIRTHDAY"
                    }
                });

                if (res.status === 200) {
                    navigate(`/gift/${res.data}`);
                }

                throw new Error(`방 생성 API 전송 오류`);   // 방 5회 이상 생겼을 경우
            } catch (e) {
                setErrorMessage("해당 이메일로 더 이상 방을 생성할 수 없습니다.");
            }
        },
        validate: ({ roomName, roomEmail, roomBirthdate }) => {
            const errors = {};
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(roomEmail)) errors.roomEmail = "이메일 형식이 올바르지 않습니다."; // @o.cnu.ac.kr 같은 이메일은 통과가 안되니 수정필요
            if (!roomName) errors.roomName = "방 이름을 입력해주세요.";
            if (!roomBirthdate) errors.roomBirthdate = "생일을 입력해주세요.";
            return errors;
        }
    });

    const handleCheckPage0 = () => {
        setErrorMessage({});
        const errors = {};

        if (!values["roomName"]) errors.roomName = "방 이름을 입력해주세요.";
        if (!values["roomBirthdate"]) errors.roomBirthdate = "생일을 입력해주세요.";
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(values["roomEmail"])) errors.roomEmail = "이메일 형식이 올바르지 않습니다.";

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
        setBackgroundStyle(e.target.value);
    }
    const handleChangeMessage = (e) => {
        setMessageStyle(e.target.value);
    }
    const handleChangePresent = (e) => {
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                            <ImageRadioGroup list={backgroundList} name="background" onChange={handleChangeBackground} />
                            <ErrorMessage>{errorMessage.backgroundStyle}</ErrorMessage>
                        </InputWrapper>
                        <InputWrapper>
                            <StyledSubTitle>메시지 선택</StyledSubTitle>
                            <ImageRadioGroup list={messageList} name="message" onChange={handleChangeMessage}/>
                            <ErrorMessage>{errorMessage.messageStyle}</ErrorMessage>
                        </InputWrapper>
                        <InputWrapper>
                            <StyledSubTitle>선물 선택</StyledSubTitle>
                            <ImageRadioGroup list={presentList} name="present" onChange={handleChangePresent} />
                            <ErrorMessage>{errorMessage.presentStyle}</ErrorMessage>
                        </InputWrapper>
                        <InputWrapper>
                            <Button variant="contained" type="button" theme={ButtonTheme} sx={{ width: 200, padding: 1, margin: 2, fontSize: 20}} disabled={isLoading} onClick={handleCheckPage1}>다음으로</Button>
                        </InputWrapper>
                    </div>
                    <div style={{ display: page === 2 ? "block" : "none" }}>
                        <StyledTitle>미리보기</StyledTitle>
                        <div></div>
                        <Button variant="contained" type="submit" theme={ButtonTheme} sx={{ width: 200, padding: 1, margin: 2, fontSize: 20}} disabled={isLoading} onClick={handleCheckPage1}> {isLoading ? <Spinner /> : "방 생성하기" }</Button>
                    </div>
                </Spacer>
            </FormBox>
        </PageWrapper>
    );
}

const PUBLIC_URL = process.env.PUBLIC_URL;

const backgroundList = [
    {
        src: PUBLIC_URL + "/contents-design-birthday/basiccake.png",
        alt: "birthday",
        value: "birthday"
    },
    {
        src: PUBLIC_URL + "/contents-design-birthday/candle.png",
        alt: "candle",
        value: "candle"
    },
    {
        src: PUBLIC_URL + "/contents-design-birthday/label.png",
        alt: "label",
        value: "label"
    },
];

const messageList = [
    {
        src: PUBLIC_URL + "/contents-design-birthday/basiccake.png",
        alt: "birthday",
        value: "birthday"
    },
    {
        src: PUBLIC_URL + "/contents-design-birthday/candle.png",
        alt: "candle",
        value: "candle"
    },
    {
        src: PUBLIC_URL + "/contents-design-birthday/label.png",
        alt: "label",
        value: "label"
    },
];

const presentList = [
    {
        src: PUBLIC_URL + "/contents-design-birthday/basiccake.png",
        alt: "birthday",
        value: "birthday"
    },
    {
        src: PUBLIC_URL + "/contents-design-birthday/candle.png",
        alt: "candle",
        value: "candle"
    },
    {
        src: PUBLIC_URL + "/contents-design-birthday/label.png",
        alt: "label",
        value: "label"
    },
];