import { Home } from "@pages/Home";
import { Routes, Route, BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/userdecision" element={<UserDecision />} /> */}
        {/* <Route path="/admin" element={<DecisionPhase />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
