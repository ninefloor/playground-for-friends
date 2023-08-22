import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { prev, refresh, visible, unvisible } from '../asset/images';
import DecisionUserItem from '../components/DecisionUserItem';
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

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  justify-content: center;
`;

const Users = styled.div`
  display: flex;
  flex-direction: row;
`;

const SmallBtn = styled.button`
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
  width: 40px;
  height: 40px;
  position: absolute;
  border-radius: 50%;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
`;

const PrevBtn = styled(SmallBtn)`
  bottom: 8px;
  left: 8px;
`;

const VisibleBtn = styled(SmallBtn)`
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 8px;
  right: 56px;
  border-radius: 50%;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
`;

const RefreshBtn = styled(SmallBtn)`
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 8px;
  right: 8px;
  border-radius: 50%;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
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

const FinalResult = styled.div`
  animation: 0.9s ease-in-out contain;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${({ result }) => {
    if (result === 'draw') return 'rgba(255, 255, 255, 0.85)';
    else if (result === 'left')
      return 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(236, 71, 88, 0.95) 100%)';
    else if (result === 'right')
      return 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(26, 123, 185, 0.95) 100%)';
  }};
  z-index: 1;
  transition: opacity 0.1s ease-in-out;
  overflow: hidden;
  > span {
    animation: 0.5s ease-in-out fade;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'chaney';
    font-size: 128px;
    text-shadow: 0px 0px 16px rgba(255, 255, 255, 0.35);
    color: ${({ result }) => {
      if (result === 'draw') return '#444';
      else if (result === 'left') return '#EC4758';
      else if (result === 'right') return '#1A7BB9';
    }};
  }
  &.hide {
    opacity: 0.1;
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

const Result = styled.div`
  width: 100%;
  height: 24px;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 8px;
  font-family: 'chaney';
  font-size: 32px;
  transform: translate(-50%);
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
  color: ${({ result }) => {
    if (result === 'draw') return '#444';
    else if (result === 'left') return '#EC4758';
    else if (result === 'right') return '#1A7BB9';
  }};
  opacity: ${({ resultvalue }) =>
    resultvalue.L + resultvalue.R !== 0 ? 1 : 0};
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

const Button = styled.button`
  font-family: 'chaney';
  font-size: 20px;
  font-weight: bold;
  padding: 16px 24px;
  background-color: #ffc107;
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  & > .window {
    width: 70%;
    max-width: 400px;
    background-color: #fff;
    border-radius: 8px;
    padding: 32px 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & > .desc {
      font-family: 'chaney';
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 16px;
    }
  }
`;

const DecisionPhase = () => {
  const [join, setJoin] = useState(false);
  const [attend, setAttend] = useState([]);
  const [isShowModal, setIsShowModal] = useState(true);
  const [picks, setPicks] = useState({});
  const [resultValue, setResultValue] = useState({ L: 0, R: 0 });
  const [result, setResult] = useState('');
  const [isFRVisible, setIsFRVisible] = useState(false);
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
    const decisionRef = ref(db, `/joinUser`);
    const queryRef = query(
      decisionRef,
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
      if (resultValue.L === resultValue.R) return 'draw';
      else if (resultValue.L > resultValue.R) return 'left';
      else if (resultValue.L < resultValue.R) return 'right';
    });
  }, [resultValue]);

  const resultMaker = () => {
    if (result === 'left') return 'left win';
    else if (result === 'right') return 'right win';
    else return 'draw';
  };

  const loginHander = () => {
    setIsShowModal(false);
    setJoin(true);
  };

  const clearDecisionHandler = () => {
    const db = getDatabase();
    const decisionRef = ref(db, `/decision`);
    setPicks({});
    const attendUsers = attend.map((el) => el.username);
    attendUsers.forEach((el) => {
      push(decisionRef, {
        username: el,
        decision: '',
        createdAt: Date.now(),
      });
    });
  };

  return (
    <Container>
      {isShowModal && (
        <Modal>
          <div className="window">
            <h2 className="desc">admin ready</h2>

            <Button onClick={loginHander}>start</Button>
          </div>
        </Modal>
      )}
      {attend.length > 0 &&
        attend.length ===
          Object.values(picks).filter((el) => el !== '').length && (
          <>
            <FinalResult className={isFRVisible && 'hide'} result={result}>
              <span>{resultMaker()}</span>
            </FinalResult>
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

      <Result resultvalue={resultValue} result={result}>
        {resultMaker()}
      </Result>

      <Graph resultvalue={resultValue} result={result}>
        <div className="L" />
        <div className="R" />
      </Graph>

      <ResultCount>
        <div className="left">{resultValue.L}</div>
        <div className="right">{resultValue.R}</div>
      </ResultCount>

      <Users>
        {attend
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
      </Users>
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
