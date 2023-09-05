import styled from 'styled-components';

const Button = styled.button`
  font-family: 'chaney';
  font-size: 20px;
  font-weight: bold;
  padding: 16px 24px;
  background-color: ${(props) => (props.disabled ? '#aaa' : '#ffc107')};
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  color: ${(props) => (props.disabled ? '#333' : '#000')};
  cursor: pointer;
`;

const BlackBtn = styled(Button)`
  position: absolute;
  font-weight: normal;
  font-size: 12px;
  padding: 8px 16px;
  background-color: #000;
  color: #fff;
`;

const CircleBtn = styled.button`
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

const DecisionButton = styled.button`
  font-family: 'chaney';
  font-size: 48px;
  background-color: #ffc107;
  color: #fff;
  cursor: pointer;
`;

const LeftBtn = styled(DecisionButton)`
  width: 50%;
  background-color: #ec4758;
`;
const RightBtn = styled(DecisionButton)`
  width: 50%;
  background-color: #1a7bb9;
`;
const GiveUpBtn = styled(DecisionButton)`
  width: 100%;
  height: 100%;
  font-size: 20px;
  background-color: #444;
`;

export {
  Button,
  BlackBtn,
  CircleBtn,
  DecisionButton,
  LeftBtn,
  RightBtn,
  GiveUpBtn,
};
