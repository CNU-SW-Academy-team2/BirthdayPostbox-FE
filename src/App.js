import { Route, Routes } from 'react-router-dom';
import { Main, CreateRoom, GiftRoom, Congratulation } from './pages'

function App() {
  return (
      <Routes>
        <Route path='/' element={<Main />}/>
        <Route path='/create' element={<CreateRoom />}/>
        <Route path='/gift/:room_id' element={<GiftRoom />}/>
        <Route path='/congratulation/:room_id/:owner_code' element={<Congratulation />}/>
        <Route path='*' element={<div>404 not founded</div>} />
      </Routes>
  );
}

export default App;