import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, BlackBtn } from '../components/atom';
import { auth } from '../data';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Container = styled.div`
  width: 100%;
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
  const [email, setEmail] = useState('');
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

  const loginHander = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pw);
      navigate('/userdecision');
    } catch (error) {
      alert('아이디나 비밀번호가 잘못되었습니다.');
    }
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
            <h2 className="desc">email</h2>
            <input
              value={email}
              type="email"
              placeholder="email"
              onChange={({ target: { value } }) => {
                setEmail(value);
              }}
            />

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
