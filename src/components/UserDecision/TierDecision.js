import styled from 'styled-components';
import {
  getDatabase,
  ref,
  push,
  orderByChild,
  limitToLast,
  query,
  onValue,
} from 'firebase/database';
import { UpBtn, DownBtn, SBtn, ABtn, BBtn, CBtn, DBtn } from '../atom';
import Decision from './Decision';
import { useEffect, useState } from 'react';

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
  const [isTierDecision, setIsTierDecision] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const tierDecisionUserRef = ref(db, `/tierDecisionUser`);
    const tierDecisionUserQueryRef = query(
      tierDecisionUserRef,
      orderByChild('createdAt'),
      limitToLast(1)
    );

    //* 티어 선택 데이터 수신
    onValue(tierDecisionUserQueryRef, (snapshot) => {
      const res = snapshot.val();
      const data = res[Object.keys(res)[0]];
      const { username: curUser } = data;
      if (curUser === username) setIsTierDecision(true);
      else setIsTierDecision(false);
    });
  });
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
      {isTierDecision ? (
        <div className="btns">
          <SBtn onClick={decisionHandler} id="S">
            S
          </SBtn>
          <ABtn onClick={decisionHandler} id="A">
            A
          </ABtn>
          <BBtn onClick={decisionHandler} id="B">
            B
          </BBtn>
          <CBtn onClick={decisionHandler} id="C">
            C
          </CBtn>
          <DBtn onClick={decisionHandler} id="D">
            D
          </DBtn>
        </div>
      ) : (
        <div className="btns">
          <UpBtn onClick={decisionHandler} id="up">
            👍
          </UpBtn>
          <DownBtn onClick={decisionHandler} id="down">
            👎
          </DownBtn>
        </div>
      )}
    </Container>
  );
};

export default TierDecision;
