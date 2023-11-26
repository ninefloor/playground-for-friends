import styled from 'styled-components';

const DecisionContainer = styled.div`
  font-family: 'chaney';
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 140px;
  font-size: 60px;
  font-weight: bold;
  text-shadow: 0px 0px 32px rgba(255, 255, 255, 0.15);
  color: ${({ decision }) => {
    if (decision === 'L') return '#EC4758';
    else if (decision === 'R') return '#1a7bb9';
    else if (decision === 'S') return '#ff4a00';
    else if (decision === 'A') return '#806cdc';
    else if (decision === 'B') return '#4573d3';
    else if (decision === 'C') return '#86bc64';
    else if (decision === 'D') return '#939ea0';
  }};

  animation: 0.4s ease-in-out fade;
  background: ${({ decision }) => {
    if (decision === 'L' || decision === 'up')
      return 'linear-gradient(180deg, rgba(236, 71, 88, 0) 0%, #ec4758 300%)';
    else if (decision === 'R' || decision === 'down')
      return 'linear-gradient(180deg, rgba(26, 123, 185, 0) 0%, #1a7bb9 300%)';
    else if (decision === 'giveup')
      return 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #333333 300%)';
    else if (decision === 'S')
      return 'linear-gradient(180deg, rgba(255, 74, 0, 0) 0%, rgba(255, 74, 0, 1) 300%)';
    else if (decision === 'A')
      return 'linear-gradient(180deg, rgba(128, 108, 220, 0) 0%, rgba(128, 108, 220, 1) 300%)';
    else if (decision === 'B')
      return 'linear-gradient(180deg, rgba(69, 115, 211, 0) 0%, rgba(69, 115, 211, 1) 300%)';
    else if (decision === 'C')
      return 'linear-gradient(180deg, rgba(134, 188, 100, 0) 0%, rgba(134, 188, 100, 1) 300%)';
    else if (decision === 'D')
      return 'linear-gradient(180deg, rgba(147, 158, 160, 0) 0%, rgba(147, 158, 160, 1) 300%)';
  }};
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

const Decision = ({ decision }) => {
  const decisionMaker = () => {
    switch (decision) {
      case 'giveup':
        return '💀';
      case 'up':
        return '👍';
      case 'down':
        return '👎';
      default:
        return decision;
    }
  };
  return (
    <DecisionContainer decision={decision}>{decisionMaker()}</DecisionContainer>
  );
};

export default Decision;
