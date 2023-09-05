import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import {
  getDatabase,
  onValue,
  ref,
  push,
  query,
  orderByChild,
  limitToLast,
} from 'firebase/database';
import {
  Button,
  GiveUpBtn,
  LeftBtn,
  RightBtn,
  Modal,
} from '../components/atom';

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

const DecisionContainer = styled.div`
  font-family: 'chaney';
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 140px;
  font-size: 60px;
  font-weight: bold;
  text-shadow: 0px 0px 32px rgba(255, 255, 255, 0.15);
  color: ${(props) => (props.decision === 'L' ? '#EC4758' : '#1a7bb9')};
  animation: 0.4s ease-in-out fade;
  background: ${(props) => {
    switch (props.decision) {
      case 'L':
        return 'linear-gradient(180deg, rgba(236, 71, 88, 0) 0%, #ec4758 300%)';
      case 'R':
        return 'linear-gradient(180deg, rgba(26, 123, 185, 0) 0%, #1a7bb9 300%)';
      case 'giveup':
        return 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #333333 300%)';
      default:
        return;
    }
  }};
  @keyframes fade {
    0% {
      opacity: 0;
      transform: translateY(5%);
    }
    100% {
      opacity: 1;
      transform: translateY(0%);
    }
  }
`;

const userOrder = {
  ryang: 1,
  kimpirya: 2,
  sike: 3,
  sunny: 4,
  jyuani: 5,
  nine: 6,
  doubl3b: 7,
};

const UserDecision = () => {
  const [decision, setDecision] = useState('');
  const [isShowModal, setIsShowModal] = useState(true);
  const [isAdminReady, setIsAdminReady] = useState(false);
  const {
    state: { username },
  } = useLocation();

  //* 어드민 입장 데이터 수신
  useEffect(() => {
    const db = getDatabase();
    const decisionRef = ref(db, `/activeAdmin`);
    const queryRef = query(
      decisionRef,
      orderByChild('createdAt'),
      limitToLast(1)
    );
    onValue(queryRef, (snapshot) => {
      const res = snapshot.val();
      const data = res[Object.keys(res)[0]];
      const { join } = data;
      setIsAdminReady(join);
    });
  }, []);

  //* 유저 퇴장 시 데이터 송신
  useEffect(() => {
    const db = getDatabase();
    const joinRef = ref(db, `/joinUser`);
    const decisionRef = ref(db, `/decision`);

    const closeHandler = () => {
      console.log('bye');
      push(joinRef, {
        username,
        join: false,
        order: userOrder[username],
        createdAt: Date.now(),
      });
      push(decisionRef, {
        username,
        decision: '',
        createdAt: Date.now(),
      });
      isShowModal(true);
    };

    window.addEventListener('beforeunload', closeHandler);
    return () => {
      window.removeEventListener('beforeunload', closeHandler);
    };
  }, []);

  //* 유저 입력 값에 따른 실시간 데이터 수신
  useEffect(() => {
    const db = getDatabase();
    const decisionRef = ref(db, `/decision`);
    const queryRef = query(
      decisionRef,
      orderByChild('createdAt'),
      limitToLast(1)
    );
    onValue(queryRef, (snapshot) => {
      const res = snapshot.val();
      const data = res[Object.keys(res)[0]];
      const { decision: curDecision, username: curUser } = data;
      if (curUser === 'all' && curDecision === 'clear') setDecision('');
      if (curUser === username) setDecision(curDecision);
    });
  }, [username]);

  const decisionHandler = ({ target: { id } }) => {
    const db = getDatabase();
    const decisionRef = ref(db, `/decision`);
    push(decisionRef, {
      username,
      decision: id,
      createdAt: Date.now(),
    });
  };

  const joinHandler = () => {
    const db = getDatabase();
    const joinRef = ref(db, `/joinUser`);
    const decisionRef = ref(db, `/decision`);
    push(joinRef, {
      username,
      join: true,
      order: userOrder[username],
      createdAt: Date.now(),
    });
    push(decisionRef, {
      username,
      decision: '',
      createdAt: Date.now(),
    });
    setIsShowModal(false);
  };

  const Decision = ({ decision }) => {
    return (
      <DecisionContainer decision={decision}>
        {decision === 'giveup' ? '💀' : decision}
      </DecisionContainer>
    );
  };

  return (
    <Container>
      {isShowModal ? (
        <Modal>
          <div className="window">
            <h2 className="desc">{isAdminReady ? 'ready' : 'not ready'}</h2>
            <Button disabled={!isAdminReady} onClick={joinHandler}>
              join
            </Button>
          </div>
        </Modal>
      ) : (
        <>
          <h1 className="title">{username}'s decision</h1>
          <Decision decision={decision} />
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
          </div>
        </>
      )}
    </Container>
  );
};

export default UserDecision;
