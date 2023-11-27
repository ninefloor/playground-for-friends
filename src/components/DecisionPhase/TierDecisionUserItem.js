import styled from 'styled-components';
import { userStyleConfig } from '../../data';
import { getDatabase, ref, push } from 'firebase/database';
import { kick } from '../../asset/images';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const User = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  transition: all 0.2s ease-in-out;
  animation: 0.4s ease-in-out fade;
  & > .userImage {
    width: 300px;
    height: 120px;
    background-image: url(${(props) => userStyleConfig[props.order].image});
    background-size: cover;
    background-position: center;
    position: relative;
    & > .decisionBtn {
      width: 120px;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      opacity: 0;
      transition: all 0.2s ease-in-out;
      position: absolute;
      left: 0;
      & .up_down {
        display: flex;
        flex-direction: column;
      }
      & .btn {
        width: 60px;
        height: 50%;
        color: #fff;
        font-family: 'chaney';
        font-size: 30px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        opacity: 0.5;
        &:hover {
          opacity: 1;
        }
        &.up {
          background: linear-gradient(
            270deg,
            rgba(236, 71, 88, 0) 0%,
            #ec4758 100%
          );
        }
        &.down {
          background: linear-gradient(
            270deg,
            rgba(26, 123, 185, 0) 0%,
            #1a7bb9 100%
          );
        }
      }
    }
    &:hover > .decisionBtn {
      opacity: 1;
    }
    & > .textBg {
      position: absolute;
      right: 0;
      width: 30%;
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      background: ${(props) => userStyleConfig[props.order].color};
    }
    & > .text {
      padding: 8px 16px;
      position: absolute;
      bottom: 0;
      right: 0;
      font-family: 'chaney';
      font-size: 24px;
      color: #fff;
      cursor: pointer;
      transition: all 0.1s ease-in-out;
      &:hover {
        text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.4);
      }
    }
    & > .btns {
      position: absolute;
      top: 4px;
      right: 4px;
      opacity: 0;
      transition: all 0.2s ease-in-out;
      display: flex;
      flex-direction: column;
      row-gap: 4px;
      & > .btn {
        padding: 4px;
        cursor: pointer;
        opacity: 0.5;
        transition: all 0.2s ease-in-out;
        &:hover {
          opacity: 1;
        }
      }
      & > .kick > img {
        width: 20px;
        height: 20px;
      }
      & > .giveup {
        font-size: 24px;
      }
    }
    &:hover > .btns {
      opacity: 1;
    }
  }

  & > .decision {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 0 16px;
    background: ${({ picks, username }) => {
      if (picks[username] === 'up')
        return 'linear-gradient(270deg, rgba(236, 71, 88, 0) 30%, rgba(236, 71, 88, 0.3) 90%)';
      if (picks[username] === 'down')
        return 'linear-gradient(270deg, rgba(26, 123, 185, 0) 30%, rgba(26, 123, 185, 0.3) 90%)';
      if (picks[username] === 'giveup')
        return 'linear-gradient(270deg, rgba(100, 100, 100, 0) 30%, rgba(100, 100, 100, 0.3) 90%)';
    }};
    & > .decisionChosen {
      opacity: ${({ picks, username }) =>
        picks[username] === 'giveup' ? '0.8' : '1'};
      color: ${({ picks, username }) =>
        picks[username] === 'up' ? '#EC4758' : '#1a7bb9'};
      text-shadow: ${({ picks, username }) =>
        `0 0 12px ${
          picks[username] === 'up'
            ? 'rgba(236, 71, 88, 0.4)'
            : 'rgba(26, 123, 185, 0.4)'
        }`};
      text-align: center;
      font-family: 'chaney';
      font-size: 60px;
      animation: 0.3s ease-in-out fade;
    }
  }

  @keyframes fade {
    0% {
      opacity: 0;
      transform: translateX(-5%);
    }
    100% {
      opacity: 1;
      transform: translateX(0%);
    }
  }
`;

const TierDecisionUserItem = ({
  user,
  picks,
  setPicks,
  setSelectedUser,
  setAttend,
}) => {
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

  const selectedUserHandler = () => {
    setSelectedUser({ username, order });
    const db = getDatabase();
    const decisionRef = ref(db, `/decision`);
    push(decisionRef, {
      username,
      decision: '',
      createdAt: Date.now(),
    });
    const tierDecisionUserRef = ref(db, `/tierDecisionUser`);
    push(tierDecisionUserRef, {
      username,
      createdAt: Date.now(),
    });
    setPicks((prev) => ({ ...prev, [username]: '' }));
  };

  const kickHandler = ({ target: { id } }) => {
    const db = getDatabase();
    const joinRef = ref(db, `/joinUser`);
    if (window.confirm('퇴장시키겠습니까?')) {
      push(joinRef, {
        username: username,
        join: false,
        createdAt: Date.now(),
      });
      setPicks((prev) => {
        const newObj = { ...prev };
        delete newObj[username];
        return newObj;
      });
      setAttend((prev) => prev.filter((user) => user.username !== id));
    } else return;
  };

  const Decision = ({ decision }) => {
    return (
      <div className="decisionChosen">
        {decision === 'giveup'
          ? '💀'
          : decision === 'up'
          ? '👍'
          : decision === 'down'
          ? '👎'
          : ''}
      </div>
    );
  };

  return (
    <Container>
      <User order={order} picks={picks} username={username}>
        <div className="userImage">
          <div className="decisionBtn">
            <div className="up_down">
              <button id="up" className="up btn" onClick={decisionHandler}>
                👍
              </button>
              <button id="down" className="down btn" onClick={decisionHandler}>
                👎
              </button>
            </div>
          </div>
          <div className="textBg"></div>
          <button className="text" onClick={selectedUserHandler}>
            {username}
          </button>
          <div className="btns">
            <button
              id="giveup"
              className="giveup btn"
              onClick={decisionHandler}
            >
              💀
            </button>
            <button className="kick btn" onClick={kickHandler}>
              <img src={kick} alt="kick" />
            </button>
          </div>
        </div>
        <div className="decision">
          <Decision decision={picks[username]} />
        </div>
      </User>
    </Container>
  );
};

export default TierDecisionUserItem;
