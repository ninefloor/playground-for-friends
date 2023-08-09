import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { prev, refresh } from '../asset/images';
import DecisionUserItem from './DecisionUserItem';

const Users = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 1px;
`;

const PrevBtn = styled.button`
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 8px;
  left: 8px;
  border-radius: 50%;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const RefreshBtn = styled.button`
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
`;

const Graph = styled.div`
  width: 100%;
  height: 16px;
  position: absolute;
  top: 0;
  display: flex;
  & > div {
    height: 100%;
    transition: all 0.4s ease-in-out;
  }
  & > .L {
    width: ${({ resultValue }) =>
      (resultValue.L / (resultValue.L + resultValue.R)) * 100 + '%'};
    background-color: #ec4758;
    box-shadow: 0px 16px 64px 0px rgba(236, 71, 88, 1);
  }
  & > .R {
    width: ${({ resultValue }) =>
      (resultValue.R / (resultValue.L + resultValue.R)) * 100 + '%'};
    background-color: #1a7bb9;
    box-shadow: 0px 16px 64px 0px rgba(26, 123, 185, 1);
  }
  & > .result {
    width: 100%;
    height: 24px;
    text-align: center;
    position: absolute;
    left: 50%;
    bottom: -24px;
    font-family: 'chaney';
    font-size: 32px;
    transform: translate(-50%);
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
    color: ${({ result }) => {
      if (result === 'draw') return '#000000';
      else if (result === 'left') return '#EC4758';
      else if (result === 'right') return '#1A7BB9';
    }};
  }
`;

const DecisionPhase = ({ attend, setIsDecision }) => {
  const [picks, setPicks] = useState({});
  const [resultValue, setResultValue] = useState({ L: 0, R: 0 });
  const [result, setResult] = useState('');

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
      if (resultValue.L === resultValue) return 'draw';
      else if (resultValue.L > resultValue.R) return 'left';
      else if (resultValue.L < resultValue.R) return 'right';
    });
  }, [picks, resultValue]);

  const resultMaker = () => {
    if (result === 'left') return 'left win';
    else if (result === 'right') return 'right win';
    else return 'draw';
  };

  return (
    <>
      {resultValue.L + resultValue.R !== 0 && (
        <Graph resultValue={resultValue} result={result}>
          <div className="L" />
          <div className="R" />
          <div className="result" result={result}>
            {resultMaker()}
          </div>
        </Graph>
      )}
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
