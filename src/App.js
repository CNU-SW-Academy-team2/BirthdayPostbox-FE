import { Route, Routes } from 'react-router-dom';
import { Main, CreateRoom, GiftRoom } from './pages'
import DefaultComponent from './components/DefaultComponent';

function App() {
  return (
    <DefaultComponent>
      <Routes>
        <Route path='/' element={<Main />}/>
        <Route path='/CreateRoom' element={<CreateRoom />}/>
        <Route path='/GiftRoom/:roomId' element={<GiftRoom />}/>
      </Routes>
    </DefaultComponent>
  );
}

export default App;