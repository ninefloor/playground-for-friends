import { useState } from 'react';
import styled from 'styled-components';
import users from './users';
import User from './User';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const Users = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 32px;
`;

const App = () => {
  const [attend, setAttend] = useState([]);

  return (
    <Container>
      <Title>참가 인원을 선택하세요</Title>
      <Title>{attend.length}</Title>
      <Users>
        {users.map((user) => (
          <User
            user={user}
            key={user.username}
            attend={attend}
            setAttend={setAttend}
          />
        ))}
      </Users>
    </Container>
  );
};

export default App;
