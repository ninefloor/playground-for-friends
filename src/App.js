import { useState } from 'react';
import styled from 'styled-components';
import PickPhase from './components/PickPhase';
import DecisionPhase from './components/DecisionPhase';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
`;

const App = () => {
  const [attend, setAttend] = useState([]);
  const [isDecision, setIsDecision] = useState(true);

  return (
    <Container>
      {isDecision ? (
        <DecisionPhase
          attend={attend}
          setAttend={setAttend}
          setIsDecision={setIsDecision}
        />
      ) : (
        <PickPhase
          attend={attend}
          setAttend={setAttend}
          setIsDecision={setIsDecision}
        />
      )}
    </Container>
  );
};

export default App;
