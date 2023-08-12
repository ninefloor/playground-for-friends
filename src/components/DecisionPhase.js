import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { prev, refresh, visible, unvisible } from '../asset/images';
import DecisionUserItem from './DecisionUserItem';

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
  opacity: ${({ resultValue }) =>
    resultValue.L + resultValue.R !== 0 ? 1 : 0};
  transition: opacity 0.2s ease-in-out;
  & > div {
    height: 100%;
    transition: all 0.4s ease-in-out;
  }
  & > .L {
    width: ${({ resultValue }) =>
      (resultValue.L / (resultValue.L + resultValue.R)) * 100 + '%'};
    background: linear-gradient(
      270deg,
      rgba(236, 71, 88, 0.05) 0%,
      #ec4758 250%
    );
  }
  & > .R {
    width: ${({ resultValue }) =>
      (resultValue.R / (resultValue.L + resultValue.R)) * 100 + '%'};
    background: linear-gradient(
      90deg,
      rgba(26, 123, 185, 0.05) 0%,
      #1a7bb9 250%
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
  opacity: ${({ resultValue }) =>
    resultValue.L + resultValue.R !== 0 ? 1 : 0};
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

const DecisionPhase = ({ attend, setIsDecision }) => {
  const [picks, setPicks] = useState({});
  const [resultValue, setResultValue] = useState({ L: 0, R: 0 });
  const [result, setResult] = useState('');
  const [isFRVisible, setIsFRVisible] = useState(false);

  useEffect(() => {
    if (attend.length === 0) setIsDecision(false);
  });

  useEffect(() => {
    setResultValue({
      L: Object.values(picks)
        .filter((el) => el !== 'giveup')
        .filter((el) => el === 'L').length,
      R: Object.values(picks)
        .filter((el) => el !== 'giveup')
        .filter((el) => el === 'R').length,
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

  return (
    <>
      {attend.length === Object.keys(picks).length && (
        <>
          <FinalResult className={isFRVisible && 'hide'} result={result}>
            <span>{resultMaker()}</span>
          </FinalResult>
          <VisibleBtn
            onClick={() => {
              setIsFRVisible((prev) => !prev);
            }}
          >
            <img src={isFRVisible ? visible : unvisible} alt="visible button" />
          </VisibleBtn>
        </>
      )}
      <DecisionPhaseText result={result}>
        <span>Decision Phase</span>
        <span>Decision Phase</span>
      </DecisionPhaseText>

      <Result resultValue={resultValue} result={result}>
        {resultMaker()}
      </Result>

      <Graph resultValue={resultValue} result={result}>
        <div className="L" />
        <div className="R" />
      </Graph>

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
      <PrevBtn
        onClick={() => {
          setIsDecision(false);
        }}
      >
        <img src={prev} alt="prev icon" />
      </PrevBtn>
      <RefreshBtn
        onClick={() => {
          setPicks({});
        }}
      >
        <img src={refresh} alt="refresh icon" />
      </RefreshBtn>
    </>
  );
};

export default DecisionPhase;
