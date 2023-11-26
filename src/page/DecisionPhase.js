import { useEffect, useState } from 'react';
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
import { Button, Modal } from '../components/atom';
import {
  Container,
  PrevBtn,
  VisibleBtn,
  RefreshBtn,
  Graph,
  FinalResultContainer,
  DecisionPhaseText,
  ResultCount,
} from './DecisionPhase.style';
import { auth } from '../data';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

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
    if (isLogin) {
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
    }
  }, [join, isLogin]);

  useEffect(() => {
    const db = getDatabase();
    const joinUserRef = ref(db, `/joinUser`);
    const decisionRef = ref(db, `/decision`);
    const joinQueryRef = query(
      joinUserRef,
      orderByChild('createdAt'),
      limitToLast(1)
    );
    const decisionQueryRef = query(
      decisionRef,
      orderByChild('createdAt'),
      limitToLast(1)
    );

    //* 어드민 로그인 확인
    onAuthStateChanged(auth, (user) => {
      if (user?.email === 'less0805@gmail.com') {
        setIsLogin(true);
        setIsShowAdminModal(false);
        setIsShowStartModal(true);
      } else setIsShowAdminModal(true);
    });

    //* 유저 입장 데이터 수신
    onValue(joinQueryRef, (snapshot) => {
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

    //* 유저 선택 데이터 수신
    onValue(decisionQueryRef, (snapshot) => {
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
      giveup: Object.values(picks).filter((el) => el === 'giveup').length,
    });
  }, [picks]);

  useEffect(() => {
    setResult(() => {
      const { L, R, giveup } = resultValue;
      if (attend.length > 0 && attend.length === L + R + giveup) {
        setIsFRVisible(true);
        if (L === R) {
          setIsShowRoulette(true);
          return 'draw';
        } else if (L > R) {
          setIsShowRoulette(false);
          return 'left';
        } else if (L < R) {
          setIsShowRoulette(false);
          return 'right';
        }
      }
    });
  }, [resultValue, attend]);

  const adminHandler = async () => {
    try {
      await signInWithEmailAndPassword(auth, 'less0805@gmail.com', pw);
      setIsShowAdminModal(false);
      setIsShowStartModal(true);
      setIsLogin(true);
    } catch (error) {
      alert('비밀번호가 잘못되었습니다.');
    }
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
      <FinalResultContainer result={result}>
        <span className="left">
          <span className="count">{resultValue.L}</span>
          left {`${result === 'left' ? 'win' : 'lose'}`}
        </span>
        <span className="right">
          <span className="count">{resultValue.R}</span>
          right {`${result === 'right' ? 'win' : 'lose'}`}
        </span>
        <span className="draw">draw</span>
      </FinalResultContainer>
    );
  };

  return (
    <Container>
      {isShowRoulette && isFRVisible && (
        <DecisionRoulette setResult={setResult} />
      )}
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
      {result !== undefined && isFRVisible && <FinalResult result={result} />}
      <DecisionPhaseText result={result}>
        <span>Decision Phase</span>
        <span>Decision Phase</span>
      </DecisionPhaseText>

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
      <Graph resultvalue={resultValue} result={result}>
        <div className="L" />
        <div className="R" />
      </Graph>
      <RefreshBtn onClick={clearDecisionHandler}>
        <img src={refresh} alt="refresh icon" />
      </RefreshBtn>
      <PrevBtn
        onClick={() => {
          setJoin(false);
          navigate('/');
        }}
      >
        <img src={prev} alt="prev icon" />
      </PrevBtn>
      {result && (
        <VisibleBtn
          onClick={() => {
            setIsFRVisible((prev) => !prev);
          }}
        >
          <img src={isFRVisible ? unvisible : visible} alt="visible button" />
        </VisibleBtn>
      )}
    </Container>
  );
};

export default DecisionPhase;
