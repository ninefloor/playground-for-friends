import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  getDatabase,
  onValue,
  ref,
  push,
  query,
  orderByChild,
  limitToLast,
} from 'firebase/database';
import { Button, Modal } from '../components/atom';
import { VoteDecision, TierDecision } from '../components/UserDecision';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../data';

const Container = styled.div`
  background: linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%);
  width: 100%;
  height: 100vh;
`;

const usernameData = {
  'sh0704x@gmail.com': 'ryang',
  'dream7726@naver.com': 'kimpirya',
  'sike@naver.com': 'sike',
  'sunny@naver.com': 'sunny',
  'sindy8528@naver.com': 'jyuani',
  'less0805@gmail.com': 'nine',
  'doubl3b@naver.com': 'doubl3b',
};

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
  const [username, setUsername] = useState('');
  const [decision, setDecision] = useState('');
  const [isShowModal, setIsShowModal] = useState(true);
  const [isAdminReady, setIsAdminReady] = useState(false);
  const [type, setType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) setUsername(usernameData[user.email]);
      else {
        alert('잘못된 접근입니다.');
        navigate('/');
      }
    });
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const activeAdminRef = ref(db, `/activeAdmin`);
    const joinRef = ref(db, `/joinUser`);
    const decisionRef = ref(db, `/decision`);
    const adminQueryRef = query(
      activeAdminRef,
      orderByChild('createdAt'),
      limitToLast(1)
    );

    //* 어드민 입장 데이터 수신
    onValue(adminQueryRef, (snapshot) => {
      const res = snapshot.val();
      const data = res[Object.keys(res)[0]];
      const { join, type } = data;
      setIsAdminReady(join);
      setType(type);
    });

    //* 유저 퇴장 데이터 송신
    const closeHandler = () => {
      push(joinRef, {
        username: username,
        join: false,
        order: userOrder[username],
        createdAt: Date.now(),
      });
      push(decisionRef, {
        username: username,
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

  //* 어드민 접속 종료 시 모달 창 출력
  useEffect(() => {
    if (!isAdminReady) {
      setIsShowModal(true);
    }
  }, [isAdminReady]);

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

  const joinHandler = () => {
    const db = getDatabase();
    const joinRef = ref(db, `/joinUser`);
    const decisionRef = ref(db, `/decision`);
    push(joinRef, {
      username: username,
      join: true,
      order: userOrder[username],
      createdAt: Date.now(),
    });
    push(decisionRef, {
      username: username,
      decision: '',
      createdAt: Date.now(),
    });
    setIsShowModal(false);
  };

  return (
    <Container>
      {isShowModal ? (
        <Modal>
          <div className="window">
            <h2 className="desc">
              {isAdminReady ? `${type} ready` : 'not ready'}
            </h2>
            <Button disabled={!isAdminReady} onClick={joinHandler}>
              join
            </Button>
          </div>
        </Modal>
      ) : type === 'vote' ? (
        <VoteDecision username={username} decision={decision} />
      ) : (
        <TierDecision username={username} decision={decision} />
      )}
    </Container>
  );
};

export default UserDecision;
