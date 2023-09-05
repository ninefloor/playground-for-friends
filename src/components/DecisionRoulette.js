import { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import { styled } from 'styled-components';
import { CircleBtn } from './atom';

const Container = styled.div`
  position: fixed;
  z-index: 1;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 320px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 0px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: 0.5s ease-in-out showRoulette;
  & > .rouletteContainer {
    position: relative;
    width: 90%;
    height: 90%;
    max-width: 320px;
    display: flex;
    justify-content: center;
    align-items: center;
    & > div {
      width: 100%;
      height: 100%;
    }
    & > button {
      z-index: 9;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  @keyframes showRoulette {
    0% {
      opacity: 0;
      transform: translate(-50%);
    }
    100% {
      opacity: 1;
      transform: translate(-50%);
    }
  }
`;

const DecisionRoulette = ({ setResult }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prize, setPrize] = useState('');
  const data = [
    {
      option: 'L',
      style: { backgroundColor: '#EC4758', textColor: '#ffffff' },
    },
    {
      option: 'R',
      style: { backgroundColor: '#1a7bb9', textColor: '#ffffff' },
    },
  ];

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrize(newPrizeNumber);
    setMustSpin(true);
  };

  return (
    <Container>
      <div className="rouletteContainer">
        <Wheel
          className="roulette"
          mustStartSpinning={mustSpin}
          spinDuration={0.5}
          data={data}
          prizeNumber={prize}
          fontFamily={'chaney'}
          fontSize={64}
          outerBorderWidth={0}
          radiusLineWidth={1}
          radiusLineColor="#fff"
          onStopSpinning={() => {
            setMustSpin(false);
            setResult(() => (prize === 0 ? 'left' : 'right'));
          }}
        />
        <CircleBtn className="spinBtn" onClick={handleSpinClick}>
          GO
        </CircleBtn>
      </div>
    </Container>
  );
};

export default DecisionRoulette;
