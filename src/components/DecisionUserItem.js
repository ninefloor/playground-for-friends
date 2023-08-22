import styled from 'styled-components';
import { userStyleConfig } from '../data';
import { getDatabase, ref, push } from 'firebase/database';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
`;

const User = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transition: all 0.2s ease-in-out;
  &:hover > .decisionBtn {
    opacity: 1;
  }
  & > .decision {
    color: ${({ picks, username }) =>
      picks[username] === 'L' ? '#EC4758' : '#1a7bb9'};
    text-align: center;
    text-shadow: 0px 0px 24px rgba(255, 255, 255, 0.4);
    font-family: 'chaney';
    font-size: 72px;
  }
  & > .decisionBtn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    opacity: 0;
    transition: all 0.2s ease-in-out;
    position: relative;
    & .btn {
      opacity: 0;
      width: 50%;
      height: 48px;
      color: #fff;
      font-family: 'chaney';
      font-size: 36px;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      &.L {
        background: linear-gradient(
          180deg,
          rgba(236, 71, 88, 0) 0%,
          #ec4758 100%
        );
        opacity: 0.5;
        &:hover {
          opacity: 1;
        }
      }
      &.R {
        background: linear-gradient(
          180deg,
          rgba(26, 123, 185, 0) 0%,
          #1a7bb9 100%
        );
        opacity: 0.5;
        &:hover {
          opacity: 1;
        }
      }
      &.giveup {
        position: absolute;
        width: 100%;
        height: 32px;
        bottom: -32px;
        font-size: 14px;
        background: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0) 100%);
        opacity: 0.7;
        &:hover {
          opacity: 1;
        }
      }
    }
  }
  & > .userImage {
    width: 136px;
    height: 160px;
    background-image: url(${(props) => userStyleConfig[props.order].image});
    background-size: cover;
    background-position: center;
  }
  & > .textBg {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    background: ${(props) => userStyleConfig[props.order].color};
    cursor: pointer;
    > .text {
      font-family: 'chaney';
      font-style: 14px;
      color: #fff;
      margin-bottom: 8px;
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

const DecisionUserItem = ({ user, picks, setPicks }) => {
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
        username,
        join: false,
        createdAt: Date.now(),
      });
      setPicks((prev) => {
        const newObj = { ...prev };
        delete newObj[username];
        return newObj;
      });
    } else return;
  };

  return (
    <Container>
      <User order={order} picks={picks} username={username}>
        <div className="decision">
          {picks[username] === 'giveup' ? '💀' : picks[username]}
        </div>
        <div className="decisionBtn">
          <button id="L" className="L btn" onClick={decisionHandler}>
            L
          </button>
          <button id="R" className="R btn" onClick={decisionHandler}>
            R
          </button>
          <button id="giveup" className="giveup btn" onClick={decisionHandler}>
            GIVE UP
          </button>
        </div>
        <button onClick={kickHandler} className="textBg">
          <span className="text">{username}</span>
        </button>
        <div className="userImage" />
      </User>
    </Container>
  );
};

export default DecisionUserItem;
