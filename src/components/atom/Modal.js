import { styled } from 'styled-components';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  & > .window {
    width: 70%;
    max-width: 400px;
    background-color: #fff;
    border-radius: 8px;
    padding: 32px 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & > .desc {
      font-family: 'chaney';
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 16px;
    }
    & > select {
      font-family: 'chaney';
      font-size: 14px;
      width: 80%;
      height: 32px;
      outline: 0;
      text-align: center;
      background-color: #eee;
      border-radius: 8px;
      margin-bottom: 24px;
    }
    & > input {
      font-family: 'Pretendard';
      font-weight: 600;
      font-size: 16px;
      width: 80%;
      padding: 8px 16px;
      height: 32px;
      outline: 0;
      text-align: center;
      background-color: #eee;
      border-radius: 8px;
      margin-bottom: 24px;
    }
  }
`;

export default Modal;
