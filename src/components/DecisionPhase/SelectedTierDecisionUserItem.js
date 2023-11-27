import styled from 'styled-components';
import { userStyleConfig } from '../../data';
import { getDatabase, ref, push } from 'firebase/database';

const Container = styled.div``;

const User = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  transition: all 0.2s ease-in-out;
  animation: 0.4s ease-in-out fade;
  position: relative;
  & > .userImage {
    width: 300px;
    height: 120px;
    background-image: url(${(props) => userStyleConfig[props.order].image});
    background-size: cover;
    background-position: center;
    position: relative;
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
    }
    & > .decisionBtn {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      opacity: 0;
      transition: all 0.2s ease-in-out;
      position: absolute;
      bottom: -60px;

      & .btn {
        flex: 1;
        height: 60px;
        color: #333;
        font-family: 'chaney';
        font-size: 30px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        opacity: 0.5;
        &:hover {
          opacity: 1;
        }
        &.s {
          background: linear-gradient(
            0deg,
            rgba(255, 74, 0, 0) 0%,
            #ff4a00 100%
          );
        }
        &.a {
          background: linear-gradient(
            0deg,
            rgba(128, 108, 220, 0) 0%,
            #806cdc 100%
          );
        }
        &.b {
          background: linear-gradient(
            0deg,
            rgba(69, 115, 211, 0) 0%,
            #4573d3 100%
          );
        }
        &.c {
          background: linear-gradient(
            0deg,
            rgba(134, 188, 100, 0) 0%,
            #86bc64 100%
          );
        }
        &.d {
          background: linear-gradient(
            0deg,
            rgba(147, 158, 160, 0) 0%,
            #939ea0 100%
          );
        }
      }
    }
    &:hover > .decisionBtn {
      opacity: 1;
    }
  }
  & > .decision {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;
    padding: 0 16px;
    background: ${({ pick }) => {
      if (pick === 'S')
        return 'linear-gradient(270deg, rgba(255, 74, 0, 0) 30%, rgba(255, 74, 0, 0.3) 90%)';
      else if (pick === 'A')
        return 'linear-gradient(270deg, rgba(128, 108, 220, 0) 30%, rgba(128, 108, 220, 0.3) 90%)';
      else if (pick === 'B')
        return 'linear-gradient(270deg, rgba(69, 115, 211, 0) 30%, rgba(69, 115, 211, 0.3) 90%)';
      else if (pick === 'C')
        return 'linear-gradient(270deg, rgba(134, 188, 100, 0) 30%, rgba(134, 188, 100, 0.3) 90%)';
      else if (pick === 'D')
        return 'linear-gradient(270deg, rgba(147, 158, 160, 0) 30%, rgba(147, 158, 160, 0.3) 90%)';
    }};
    & > .decisionChosen {
      color: ${({ pick }) => {
        if (pick === 'S') return '#ff4a00';
        else if (pick === 'A') return '#806cdc';
        else if (pick === 'B') return '#4573d3';
        else if (pick === 'C') return '#86bc64';
        else if (pick === 'D') return '#939ea0';
      }};
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

const SelectedTierDecisionUserItem = ({ selectedUser, picks }) => {
  const { username, order } = selectedUser;

  const decisionHandler = ({ target: { id } }) => {
    const db = getDatabase();
    const decisionRef = ref(db, `/decision`);
    push(decisionRef, {
      username,
      decision: id,
      createdAt: Date.now(),
    });
  };

  const Decision = ({ decision }) => {
    return <div className="decisionChosen">{decision}</div>;
  };

  return (
    <Container>
      <User order={order} pick={picks[username]} username={username}>
        <div className="userImage">
          <div className="textBg" />
          <div className="text">{username}</div>
          <div className="decisionBtn">
            <button id="S" className="s btn" onClick={decisionHandler}>
              S
            </button>
            <button id="A" className="a btn" onClick={decisionHandler}>
              A
            </button>
            <button id="B" className="b btn" onClick={decisionHandler}>
              B
            </button>
            <button id="C" className="c btn" onClick={decisionHandler}>
              C
            </button>
            <button id="D" className="d btn" onClick={decisionHandler}>
              D
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

export default SelectedTierDecisionUserItem;
