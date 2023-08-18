import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Login, UserDecision } from './page';

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/userdecision" element={<UserDecision />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
