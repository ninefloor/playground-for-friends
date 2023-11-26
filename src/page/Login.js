import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, BlackBtn } from '../components/atom';
import { useLogin } from '../hook';
import Loading from '../components/Loading';

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
  const [isShowLoginModal, setIsShowLoginModal] = useState(false);
  const { email, emailHandler, pw, pwHander, isLoading, loginHander } =
    useLogin('/userdecision');
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
            {isLoading && <Loading />}
            <h2 className="desc">email</h2>
            <input value={email} type="email" onChange={emailHandler} />

            <h2 className="desc">password</h2>
            <input
              type="password"
              value={pw}
              onKeyUp={({ key }) => {
                if (key === 'Enter') loginHander();
              }}
              onChange={pwHander}
            />
            <Button onClick={loginHander}>login</Button>
          </div>
        </Modal>
      )}
    </Container>
  );
};

export default Login;
