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

~~
3. storybook 
npx -p @storybook/cli sb init
~~

4. feather icon
npm install feather-icons

5. axios
yarn add axios


6. React Router
yarn add react-router-dom

~~
설치 이후 craco.config.js 파일을 다음과 같이 변경

const path = require('path');

module.exports = {
    babel: {
        presets: ["@emotion/babel-preset-css-prop"],
    },
    webpack: {
        alias:  {
            '@components':  path.resolve(__dirname, 'src/components'),
            '@hooks':  path.resolve(__dirname, 'src/hooks'),
            '@contexts':  path.resolve(__dirname, 'src/contexts'),
            '@pages':  path.resolve(__dirname, 'src/pages'),
        }
    }
} 

src/index.js 에서 <App />을 <BrowserRouter></BrowserRouter>로 감싸줌
~~