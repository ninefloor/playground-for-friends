import { getDatabase, ref, push } from 'firebase/database';
import { Container, User } from './DecisionUserItem.style';

const DecisionUserItem = ({ user, picks, setPicks, setAttend }) => {
  const { username, order } = user;

  const decisionHandler = ({ target: { id } }) => {
    const db = getDatabase();
    const decisionRef = ref(db, `/decision`);
    push(decisionRef, {
      username,
      decision: id,
      createdAt: Date.now(),
    });
  };

  const kickHandler = ({ target: { id } }) => {
    const db = getDatabase();
    const joinRef = ref(db, `/joinUser`);
    if (window.confirm('퇴장시키겠습니까?')) {
      push(joinRef, {
        username: id,
        join: false,
        createdAt: Date.now(),
      });
      setPicks((prev) => {
        const newObj = { ...prev };
        delete newObj[id];
        return newObj;
      });
      setAttend((prev) => prev.filter((user) => user.username !== username));
    } else return;
  };

  const Decision = ({ decision }) => {
    return (
      <div className="decisionChosen">
        {decision === 'giveup' ? '💀' : decision}
      </div>
    );
  };

  return (
    <Container>
      <User order={order} picks={picks} username={username}>
        <div className="decision">
          <Decision decision={picks[username]} />
        </div>
        <div className="textBg" />
        <button className="text" onClick={kickHandler} id={username}>
          {username}
        </button>
        <div className="userImage">
          <div className="decisionBtn">
            <button id="L" className="L btn" onClick={decisionHandler}>
              L
            </button>
            <button id="R" className="R btn" onClick={decisionHandler}>
              R
            </button>
            <button
              id="giveup"
              className="giveup btn"
              onClick={decisionHandler}
            >
              GIVE UP
            </button>
          </div>
        </div>
      </User>
    </Container>
  );
};

export default DecisionUserItem;
