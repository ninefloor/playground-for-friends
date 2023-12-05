import { useEffect, useState } from 'react';
import { prev, refresh, visible, unvisible } from '../../asset/images';
import { DecisionUserItem, DecisionRoulette } from './index';
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
import {
  Container,
  PrevBtn,
  VisibleBtn,
  RefreshBtn,
  Graph,
  FinalResultContainer,
  ResultCount,
} from './VoteAdmin.style';

const VoteAdmin = () => {
  const [attend, setAttend] = useState([]);
  const [picks, setPicks] = useState({});
  const [resultValue, setResultValue] = useState({ L: 0, R: 0 });
  const [result, setResult] = useState('');
  const [isFRVisible, setIsFRVisible] = useState(false);
  const [isShowRoulette, setIsShowRoulette] = useState(false);
  const navigate = useNavigate();

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

  //* 결과 집계
  useEffect(() => {
    setResultValue({
      L: Object.values(picks).filter((el) => el === 'L').length,
      R: Object.values(picks).filter((el) => el === 'R').length,
      giveup: Object.values(picks).filter((el) => el === 'giveup').length,
    });
  }, [picks]);

  //* 최종 결과 도출
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
      {result !== undefined && isFRVisible && <FinalResult result={result} />}

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
                setAttend={setAttend}
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
                setAttend={setAttend}
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
                setAttend={setAttend}
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

export default VoteAdmin;
