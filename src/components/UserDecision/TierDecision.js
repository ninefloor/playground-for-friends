import styled from 'styled-components';
import { getDatabase, ref, push } from 'firebase/database';
import { UpBtn, DownBtn } from '../atom';
import Decision from './Decision';

const Container = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  .title {
    font-family: 'chaney';
    font-size: 16px;
    margin-top: 20px;
    text-shadow: 0px 0px 32px rgba(0, 0, 0, 0.15);
  }
  & > .btns {
    width: 100%;
    height: 80%;

    display: flex;
    flex-direction: column;
  }
`;

const TierDecision = ({ username, decision }) => {
  const decisionHandler = async ({ target: { id } }) => {
    if (decision === id) return;
    const db = getDatabase();
    const decisionRef = ref(db, `/decision`);
    await push(decisionRef, {
      username,
      decision: id,
      createdAt: Date.now(),
    });
  };

  return (
    <Container>
      <h1 className="title">{username}'s decision</h1>
      <Decision decision={decision} />
      <div className="btns">
        <UpBtn onClick={decisionHandler} id="up">
          👍
        </UpBtn>
        <DownBtn onClick={decisionHandler} id="down">
          👎
        </DownBtn>
      </div>
    </Container>
  );
};

export default TierDecision;
