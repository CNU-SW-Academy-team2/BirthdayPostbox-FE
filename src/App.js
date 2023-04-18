import { Route, Routes } from 'react-router-dom';
import { Main, CreateRoom, GiftRoom, Congratulation } from './pages'

function App() {
  return (
      <Routes>
        <Route path='/' element={<Main />}/>
        <Route path='/create' element={<CreateRoom />}/>
        <Route path='/gift/:roomId' element={<GiftRoom />}/>
        <Route path='/congratulation/:roomId/:ownerCode' element={<Congratulation />}/>
        <Route path='*' element={<div>404 not founded</div>} />
      </Routes>
  );
}

export default App;