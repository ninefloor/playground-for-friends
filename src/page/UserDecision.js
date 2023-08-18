import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  & > .title {
    font-family: 'chaney';
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
    text-shadow: 0px 0px 32px rgba(0, 0, 0, 0.15);
  }
  & > .btns {
    width: 100%;
    height: 80%;
    & > .left_right {
      width: 100%;
      height: 80%;
      display: flex;
    }
    & > .giveup {
      width: 100%;
      height: 20%;
    }
  }
`;

const Decision = styled.div`
  font-family: 'chaney';
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 140px;
  font-size: 60px;
  font-weight: bold;
  text-shadow: 0px 0px 32px rgba(255, 255, 255, 0.15);
  color: ${({ decision }) => (decision === 'L' ? '#EC4758' : '#1a7bb9')};

  background: ${({ decision }) =>
    decision === 'L'
      ? 'linear-gradient(180deg, rgba(236, 71, 88, 0) 0%, #ec4758 300%)'
      : decision === 'R'
      ? 'linear-gradient(180deg, rgba(26, 123, 185, 0) 0%, #1a7bb9 300%)'
      : 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #333333 300%)'};
`;

const Button = styled.button`
  font-family: 'chaney';
  font-size: 48px;
  background-color: #ffc107;
  color: #fff;
  cursor: pointer;
`;

const LeftBtn = styled(Button)`
  width: 50%;
  background-color: #ec4758;
`;
const RightBtn = styled(Button)`
  width: 50%;
  background-color: #1a7bb9;
`;
const GiveUpBtn = styled(Button)`
  width: 100%;
  height: 100%;
  font-size: 20px;
  background-color: #444;
`;

const UserDecision = () => {
  const [decision, setDecision] = useState('');

  const decisionHandler = ({ target: { id } }) => {
    if (id === 'giveup') setDecision('💀');
    else setDecision(id);
  };
  return (
    <Container>
      <h1 className="title">user decision</h1>
      <Decision decision={decision}>{decision}</Decision>
      <div className="btns">
        <div className="left_right">
          <LeftBtn onClick={decisionHandler} id="L">
            L
          </LeftBtn>
          <RightBtn onClick={decisionHandler} id="R">
            R
          </RightBtn>
        </div>
        <div className="giveup">
          <GiveUpBtn onClick={decisionHandler} id="giveup">
            give up
          </GiveUpBtn>
        </div>
        <div></div>
      </div>
    </Container>
  );
};

export default UserDecision;
