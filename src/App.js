import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Login, UserDecision, DecisionPhase } from './page';

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/userdecision" element={<UserDecision />} />
        <Route path="/admin" element={<DecisionPhase />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
