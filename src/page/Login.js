import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  & > .title {
    font-family: 'chaney';
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 60px;
    text-shadow: 0px 0px 32px rgba(0, 0, 0, 0.15);
  }
`;

const Button = styled.button`
  font-family: 'chaney';
  font-size: 20px;
  font-weight: bold;
  padding: 16px 24px;
  background-color: #ffc107;
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

const PcBtn = styled(Button)`
  position: absolute;
  font-weight: normal;
  top: 16px;
  right: 16px;
  font-size: 12px;
  padding: 8px 16px;
  background-color: #000;
  color: #fff;
`;

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
    }
    & > select {
      font-family: 'chaney';
      font-size: 14px;
      margin: 24px 0px;
      width: 80%;
      height: 32px;
      outline: 0;
      text-align: center;
      background-color: #eee;
      border-radius: 8px;
    }
    & > input {
      font-family: 'chaney';
      font-size: 16px;
      margin: 24px 0px;
      width: 80%;
      padding: 8px 16px;
      height: 32px;
      outline: 0;
      text-align: center;
      background-color: #eee;
      border-radius: 8px;
    }
  }
`;

const Login = () => {
  const [user, setUser] = useState('ryang');
  const [pw, setPw] = useState('');
  const [isShowModal, setIsShowModal] = useState(false);

  const modalHandler = () => {
    setIsShowModal((prev) => !prev);
  };

  const pcUserHander = () => {
    window.open(
      window.location.href,
      '_blank',
      'popup=true, scrollbars=0, location=0'
    );
  };

  // TODO: 선택 페이지 생성 후 로그인 완료 시 선택 페이지로 이동

  return (
    <Container>
      <h1 className="title">vote for honeyz</h1>

      <Button onClick={modalHandler}>join</Button>
      <PcBtn onClick={pcUserHander}>PC Ver.</PcBtn>
      {isShowModal && (
        <Modal onClick={modalHandler}>
          <div
            className="window"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h2 className="desc">user</h2>
            <select
              value={user}
              placeholder="select"
              onChange={({ target: { value } }) => {
                setUser(value);
              }}
            >
              <option>ryang</option>
              <option>kimpirya</option>
              <option>sike</option>
              <option>sunny</option>
              <option>jyuani</option>
              <option>nine</option>
              <option>doubl3b</option>
            </select>
            <h2 className="desc">password</h2>
            <input
              type="password"
              value={pw}
              onChange={({ target: { value } }) => {
                setPw(value);
              }}
            />
            <Button>login</Button>
          </div>
        </Modal>
      )}
    </Container>
  );
};

export default Login;
