import styled from 'styled-components';
import { userStyleConfig } from '../data';

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
    text-shadow: 0px 4px 6px rgba(0, 0, 0, 0.25);
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
  & > img {
    width: 136px;
    height: 160px;
    object-fit: cover;
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
    > .text {
      font-family: 'chaney';
      font-style: 14px;
      color: #fff;
      margin-bottom: 8px;
    }
  }
`;

const DecisionUserItem = ({ user, picks, setPicks, setResultValue }) => {
  const { username, order } = user;

  const decisionHandler = (e) => {
    const { id } = e.target;
    setPicks((prev) => ({ ...prev, [username]: id }));
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
        <div className="textBg">
          <span className="text">{username}</span>
        </div>
        <img src={userStyleConfig[order].image} alt={username} />
      </User>
    </Container>
  );
};

export default DecisionUserItem;
