# 라이브러리 설치

1. craco
yarn add @craco/craco

설치 이후 package.json에서 scripts를 다음과 같이 변경

"scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test"
}


2. emotion
yarn add @emotion/react
yarn add @emotion/styled
yarn add -D @emotion/babel-preset-css-prop

이후 프로젝트 최상단에서 craco.config.js 파일을 생성하고 다음의 내용을 입력
module.exports = {
    babel: {
        presets: ["@emotion/babel-preset-css-prop"],
    },
}

3. feather icon
npm install feather-icons

4. axios
yarn add axios


5. React Router
yarn add react-router-dom


src/index.js 에서 <App />을 <BrowserRouter></BrowserRouter>로 감싸줌
