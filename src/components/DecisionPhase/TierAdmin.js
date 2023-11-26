import { useEffect, useState } from 'react';
import { prev, refresh } from '../../asset/images';
import { TierDecisionUserItem, SelectedTierDecisionUserItem } from './index';
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
import { Container, PrevBtn, RefreshBtn } from './TierAdmin.style';

const TierAdmin = () => {
  const [attend, setAttend] = useState([]);
  const [selectedUser, setSelectedUser] = useState({
    username: '',
    order: 0,
  });
  const [picks, setPicks] = useState({});
  const [resultValue, setResultValue] = useState({ up: 0, down: 0 });
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

  const clearDecisionHandler = () => {
    const db = getDatabase();
    const decisionRef = ref(db, `/decision`);
    setPicks({});
    setSelectedUser({ username: '', pick: '', order: 0 });
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
      <div className="selectedUser">
        {selectedUser.order !== 0 && (
          <>
            <span className="selectedTitle">Decision Tier</span>
            <SelectedTierDecisionUserItem
              selectedUser={selectedUser}
              picks={picks}
            />
          </>
        )}
      </div>
      <div className="users">
        <div className="decisionUsers left">
          {attend
            .filter(
              ({ username }) =>
                picks[username] === 'up' && selectedUser.username !== username
            )
            .sort((a, b) => a.order - b.order)
            .map((user) => (
              <TierDecisionUserItem
                user={user}
                key={user.username}
                picks={picks}
                setPicks={setPicks}
                setSelectedUser={setSelectedUser}
              />
            ))}
        </div>
        <div className="decisionUsers draw">
          {attend
            .filter(
              ({ username }) =>
                (picks[username] === '' || picks[username] === 'giveup') &&
                selectedUser.username !== username
            )
            .sort((a, b) => a.order - b.order)
            .map((user) => (
              <TierDecisionUserItem
                user={user}
                key={user.username}
                picks={picks}
                setPicks={setPicks}
                setSelectedUser={setSelectedUser}
              />
            ))}
        </div>
        <div className="decisionUsers right">
          {attend
            .filter(
              ({ username }) =>
                picks[username] === 'down' && selectedUser.username !== username
            )
            .sort((a, b) => a.order - b.order)
            .map((user) => (
              <TierDecisionUserItem
                user={user}
                key={user.username}
                picks={picks}
                setPicks={setPicks}
                setSelectedUser={setSelectedUser}
              />
            ))}
        </div>
      </div>
      <PrevBtn
        onClick={() => {
          navigate('/');
        }}
      >
        <img src={prev} alt="prev icon" />
      </PrevBtn>
      <RefreshBtn onClick={clearDecisionHandler}>
        <img src={refresh} alt="refresh icon" />
      </RefreshBtn>
    </Container>
  );
};

export default TierAdmin;
