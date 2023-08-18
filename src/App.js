import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Login } from './page';

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
