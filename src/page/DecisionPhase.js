import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { prev, refresh, visible, unvisible } from '../asset/images';
import { DecisionUserItem, DecisionRoulette } from '../components';
import {
  getDatabase,
  onValue,
  ref,
  push,
  query,
  orderByChild,
  limitToLast,
} from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { Button, CircleBtn, Modal } from '../components/atom';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  justify-content: center;
  overflow: hidden;
  & > .users {
    width: 100%;
    display: flex;
    padding: 0 64px;
    justify-content: space-between;
    align-items: flex-end;
    > .decisionUsers {
      min-width: 136px;
      display: flex;
    }
  }
`;

const PrevBtn = styled(CircleBtn)`
  bottom: 8px;
  left: 8px;
`;

const VisibleBtn = styled(CircleBtn)`
  bottom: 8px;
  right: 56px;
`;

const RefreshBtn = styled(CircleBtn)`
  bottom: 8px;
  right: 8px;
`;

const Graph = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  display: flex;
  opacity: ${({ resultvalue }) =>
    resultvalue.L + resultvalue.R !== 0 ? 1 : 0};
  transition: opacity 0.2s ease-in-out;
  & > div {
    height: 100%;
    transition: all 0.4s ease-in-out;
  }
  & > .L {
    width: ${({ resultvalue }) =>
      (resultvalue.L / (resultvalue.L + resultvalue.R)) * 100 + '%'};
    background: linear-gradient(225deg, rgba(236, 71, 88, 0) 30%, #ec4758 200%);
  }
  & > .R {
    width: ${({ resultvalue }) =>
      (resultvalue.R / (resultvalue.L + resultvalue.R)) * 100 + '%'};
    background: linear-gradient(
      135deg,
      rgba(26, 123, 185, 0) 30%,
      #1a7bb9 200%
    );
  }
`;

const FinalResultContainer = styled.div`
  width: 100%;
  height: 140px;
  animation: 0.9s ease-in-out contain;
  position: absolute;
  bottom: 0;
  background: ${({ result }) => {
    if (result === 'draw')
      return 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.85) 100%)';
    else if (result === 'left')
      return 'linear-gradient(180deg, rgba(236, 71, 88, 0) 0%, rgba(236, 71, 88, 1) 80%)';
    else if (result === 'right')
      return 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(26, 123, 185, 1) 80%)';
  }};
  z-index: 1;
  transition: opacity 0.2s ease-in-out;
  overflow: hidden;
  > span {
    margin-top: 12px;
    animation: 0.5s ease-in-out fade;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'chaney';
    font-size: 64px;
    text-shadow: 0px 0px 12px rgba(255, 255, 255, 0.7);
    color: ${({ result }) => (result === 'draw' ? '#444' : '#eee')};
  }
  &.hide {
    opacity: 0;
  }
  @keyframes contain {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
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

const DecisionPhaseText = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 0;
  padding: 6px 8px 0 8px;

  font-size: 12px;
  font-family: 'chaney';
  opacity: 0.5;
  & span:first-child {
    color: ${({ result }) => {
      if (result === 'draw') return '#333';
      else return '#EC4758';
    }};
  }
  & span:last-child {
    color: ${({ result }) => {
      if (result === 'draw') return '#333';
      else return '#1A7BB9';
    }};
  }
`;

const ResultCount = styled.div`
  width: 100%;
  display: flex;
  position: absolute;
  top: 16px;
  & > div {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'chaney';
    font-size: 96px;
    text-shadow: 0px 4px 24px rgba(255, 255, 255, 0.2);
    opacity: 0.5;
    &.left {
      left: 16px;
      color: #ec4758;
    }
    &.right {
      right: 16px;
      color: #1a7bb9;
    }
  }
`;

const DecisionPhase = () => {
  const [join, setJoin] = useState(false);
  const [attend, setAttend] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [pw, setPw] = useState('');
  const [isShowAdminModal, setIsShowAdminModal] = useState(true);
  const [isShowStartModal, setIsShowStartModal] = useState(false);
  const [picks, setPicks] = useState({});
  const [resultValue, setResultValue] = useState({ L: 0, R: 0 });
  const [result, setResult] = useState('');
  const [isFRVisible, setIsFRVisible] = useState(false);
  const [isShowRoulette, setIsShowRoulette] = useState(false);
  const navigate = useNavigate();

  //* Admin 입/퇴장 데이터 송신
  useEffect(() => {
    const db = getDatabase();
    const adminRef = ref(db, `/activeAdmin`);
    push(adminRef, {
      join,
      createAt: Date.now(),
    });
    return () => {
      push(adminRef, {
        join: false,
        createAt: Date.now(),
      });
    };
  }, [join]);

  //* 유저 입장 데이터 수신
  useEffect(() => {
    const db = getDatabase();
    const joinUserRef = ref(db, `/joinUser`);
    const queryRef = query(
      joinUserRef,
      orderByChild('createdAt'),
      limitToLast(1)
    );
    onValue(queryRef, (snapshot) => {
      const res = snapshot.val();
      const data = res[Object.keys(res)[0]];
      const { join: curJoin, username: curUser, order } = data;
      if (curJoin)
        setAttend((prev) =>
          prev.map((el) => el.username).includes(curUser)
            ? prev
            : [...prev, { username: curUser, order }]
        );
      else setAttend((prev) => prev.filter((el) => el.username !== curUser));
    });
  }, []);

  //* 유저 선택 데이터 수신
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
      setPicks((prev) => ({ ...prev, [curUser]: curDecision }));
    });
  }, []);

  useEffect(() => {
    setResultValue({
      L: Object.values(picks).filter((el) => el === 'L').length,
      R: Object.values(picks).filter((el) => el === 'R').length,
    });
  }, [picks]);

  useEffect(() => {
    setResult(() => {
      const { L, R } = resultValue;
      if (L + R === 0) {
        setIsShowRoulette(false);
        return '';
      } else if (L === R) {
        setIsShowRoulette(true);
        return 'draw';
      } else if (L > R) {
        setIsShowRoulette(false);
        return 'left';
      } else if (L < R) {
        setIsShowRoulette(false);
        return 'right';
      }
    });
  }, [resultValue]);

  const resultMaker = () => {
    if (result === 'left') return 'left win';
    else if (result === 'right') return 'right win';
    else return 'draw';
  };

  const adminHandler = () => {
    if (pw === process.env[`REACT_APP_ADMIN_PW`]) {
      setIsShowAdminModal(false);
      setIsShowStartModal(true);
      setIsLogin(true);
    } else alert('비밀번호가 맞지 않습니다.');
  };

  const joinHander = () => {
    if (isLogin) {
      setIsShowStartModal(false);
      setJoin(true);
    } else alert('비정상적인 접근입니다. 비밀번호를 입력하여 접속하세요.');
  };

  const clearDecisionHandler = () => {
    const db = getDatabase();
    const decisionRef = ref(db, `/decision`);
    setPicks({});
    setIsFRVisible(false);
    setIsShowRoulette(false);
    const attendUsers = attend.map((el) => el.username);
    attendUsers.forEach((el) => {
      push(decisionRef, {
        username: el,
        decision: '',
        createdAt: Date.now(),
      });
    });
  };

  const FinalResult = ({ result }) => {
    return (
      <FinalResultContainer className={isFRVisible && 'hide'} result={result}>
        <span>{resultMaker()}</span>
      </FinalResultContainer>
    );
  };

  return (
    <Container>
      {isShowRoulette && <DecisionRoulette setResult={setResult} />}
      {isShowStartModal && (
        <Modal>
          <div className="window">
            <h2 className="desc">admin ready</h2>

            <Button onClick={joinHander}>start</Button>
          </div>
        </Modal>
      )}
      {isShowAdminModal && (
        <Modal>
          <div
            className="window"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h2 className="desc">password</h2>
            <input
              type="password"
              value={pw}
              onKeyUp={({ key }) => {
                if (key === 'Enter') adminHandler();
              }}
              onChange={({ target: { value } }) => {
                setPw(value);
              }}
            />
            <Button onClick={adminHandler}>login</Button>
          </div>
        </Modal>
      )}
      {attend.length > 0 &&
        attend.length ===
          Object.values(picks).filter((el) => el !== '').length && (
          <>
            <FinalResult result={result} />
            <VisibleBtn
              onClick={() => {
                setIsFRVisible((prev) => !prev);
              }}
            >
              <img
                src={isFRVisible ? visible : unvisible}
                alt="visible button"
              />
            </VisibleBtn>
          </>
        )}
      <DecisionPhaseText result={result}>
        <span>Decision Phase</span>
        <span>Decision Phase</span>
      </DecisionPhaseText>

      <Graph resultvalue={resultValue} result={result}>
        <div className="L" />
        <div className="R" />
      </Graph>

      <ResultCount>
        <div className="left">{resultValue.L}</div>
        <div className="right">{resultValue.R}</div>
      </ResultCount>

      <div className="users">
        <div className="decisionUsers left">
          {attend
            .filter(({ username }) => picks[username] === 'L')
            .sort((a, b) => a.order - b.order)
            .map((user) => (
              <DecisionUserItem
                user={user}
                key={user.username}
                attend={attend}
                picks={picks}
                setPicks={setPicks}
                setResultValue={setResultValue}
              />
            ))}
        </div>
        <div className="decisionUsers draw">
          {attend
            .filter(
              ({ username }) =>
                picks[username] === '' || picks[username] === 'giveup'
            )
            .sort((a, b) => a.order - b.order)
            .map((user) => (
              <DecisionUserItem
                user={user}
                key={user.username}
                attend={attend}
                picks={picks}
                setPicks={setPicks}
                setResultValue={setResultValue}
              />
            ))}
        </div>
        <div className="decisionUsers right">
          {attend
            .filter(({ username }) => picks[username] === 'R')
            .sort((a, b) => a.order - b.order)
            .map((user) => (
              <DecisionUserItem
                user={user}
                key={user.username}
                attend={attend}
                picks={picks}
                setPicks={setPicks}
                setResultValue={setResultValue}
              />
            ))}
        </div>
      </div>
      <RefreshBtn
        onClick={() => {
          clearDecisionHandler();
        }}
      >
        <img src={refresh} alt="refresh icon" />
      </RefreshBtn>
      <PrevBtn
        onClick={() => {
          setJoin(false);
          navigate(-1);
        }}
      >
        <img src={prev} alt="prev icon" />
      </PrevBtn>
    </Container>
  );
};

export default DecisionPhase;
