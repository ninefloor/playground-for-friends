import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, BlackBtn } from '../components/atom';

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background: linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%);
  & > .title {
    font-family: 'chaney';
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 60px;
    text-shadow: 0px 0px 32px rgba(0, 0, 0, 0.15);
  }
`;

const AdminBtn = styled(BlackBtn)`
  top: 16px;
  left: 16px;
`;

const PcBtn = styled(BlackBtn)`
  top: 16px;
  right: 16px;
`;

const Login = () => {
  const [username, setUsername] = useState('ryang');
  const [pw, setPw] = useState('');
  const [isShowLoginModal, setIsShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const loginModalHandler = () => {
    setIsShowLoginModal((prev) => !prev);
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

  return (
    <Container>
      <h1 className="title">vote for honeyz</h1>

      <Button onClick={loginModalHandler}>join</Button>
      <AdminBtn
        onClick={() => {
          navigate('admin');
        }}
      >
        admin
      </AdminBtn>
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
    </Container>
  );
};

export default Login;
