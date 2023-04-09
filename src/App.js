import { Route, Routes } from 'react-router-dom';
import { Main, CreateRoom, GiftRoom, Congratulation } from './pages'

function App() {
  return (
      <Routes>
        <Route path='/' element={<Main />}/>
        <Route path='/CreateRoom' element={<CreateRoom />}/>
        <Route path='/GiftRoom/:roomId' element={<GiftRoom />}/>
        <Route path='/Congratulation/:roomId' element={<Congratulation />}/>
      </Routes>
  );
}

export default App;