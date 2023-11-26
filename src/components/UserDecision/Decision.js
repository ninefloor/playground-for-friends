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
  color: ${(props) => (props.decision === 'L' ? '#EC4758' : '#1a7bb9')};
  animation: 0.4s ease-in-out fade;
  background: ${(props) => {
    if (props.decision === 'L' || props.decision === 'up')
      return 'linear-gradient(180deg, rgba(236, 71, 88, 0) 0%, #ec4758 300%)';
    else if (props.decision === 'R' || props.decision === 'down')
      return 'linear-gradient(180deg, rgba(26, 123, 185, 0) 0%, #1a7bb9 300%)';
    else if (props.decision === 'giveup')
      return 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #333333 300%)';
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
