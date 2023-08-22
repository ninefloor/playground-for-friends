import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const AdminBtn = styled(Button)`
  position: absolute;
  font-weight: normal;
  top: 16px;
  left: 16px;
  font-size: 12px;
  padding: 8px 16px;
  background-color: #000;
  color: #fff;
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
      margin-bottom: 24px;
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
      font-family: 'chaney';
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

const Login = () => {
  const [username, setUsername] = useState('ryang');
  const [pw, setPw] = useState('');
  const [isShowLoginModal, setIsShowLoginModal] = useState(false);
  const [isShowAdminModal, setIsShowAdminModal] = useState(false);
  const navigate = useNavigate();

  const loginModalHandler = () => {
    setIsShowLoginModal((prev) => !prev);
  };
  const adminModalHandler = () => {
    setIsShowAdminModal((prev) => !prev);
  };

  const pcUserHander = () => {
    window.open(
      window.location.href,
      '_blank',
      'popup=true, scrollbars=0, location=0'
    );
  };

  const loginHander = () => {
    if (pw === process.env[`REACT_APP_${username.toUpperCase()}_PW`]) {
      navigate('/userdecision', { state: { username } });
    } else alert('비밀번호가 맞지 않습니다.');
  };

  const adminHandler = () => {
    if (pw === process.env[`REACT_APP_ADMIN_PW`]) navigate('/admin');
    else alert('비밀번호가 맞지 않습니다.');
  };

  return (
    <Container>
      <h1 className="title">vote for honeyz</h1>

      <Button onClick={loginModalHandler}>join</Button>
      <AdminBtn onClick={adminModalHandler}>admin</AdminBtn>
      <PcBtn onClick={pcUserHander}>PC Ver.</PcBtn>
      {isShowLoginModal && (
        <Modal onClick={loginModalHandler}>
          <div
            className="window"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h2 className="desc">user</h2>
            <select
              value={username}
              placeholder="select"
              onChange={({ target: { value } }) => {
                setUsername(value);
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
              onKeyUp={({ key }) => {
                if (key === 'Enter') loginHander();
              }}
              onChange={({ target: { value } }) => {
                setPw(value);
              }}
            />
            <Button onClick={loginHander}>login</Button>
          </div>
        </Modal>
      )}
      {isShowAdminModal && (
        <Modal onClick={adminModalHandler}>
          <div
            className="window"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h2 className="desc">password</h2>
            <input
              type="password"
              value={pw}
              onKeyUp={({ key }) => {
                if (key === 'Enter') adminHandler();
              }}
              onChange={({ target: { value } }) => {
                setPw(value);
              }}
            />
            <Button onClick={adminHandler}>login</Button>
          </div>
        </Modal>
      )}
    </Container>
  );
};

export default Login;
