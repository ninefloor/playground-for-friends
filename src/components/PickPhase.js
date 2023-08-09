import styled from 'styled-components';
import { users } from '../data';
import SelectUserItem from './SelectUserItem';
import { next } from '../asset/images';

const Title = styled.h1`
  font-family: 'chaney';
  font-size: 60px;
  font-weight: bold;
  margin-bottom: 60px;
`;

const Users = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 1px;
`;
const NextBtn = styled.button`
  width: 40px;
  height: 40px;
  position: absolute;
  top: 8px;
  right: 8px;
  border-radius: 50%;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const PickPhase = ({ attend, setAttend, setIsDecision }) => {
  return (
    <>
      <Title>PICK PHASE</Title>
      <Users>
        {users.map((user) => (
          <SelectUserItem
            user={user}
            key={user.username}
            attend={attend}
            setAttend={setAttend}
          />
        ))}
      </Users>
      <NextBtn
        onClick={() => {
          if (attend.length !== 0) setIsDecision(true);
        }}
      >
        <img src={next} alt="next icon" />
      </NextBtn>
    </>
  );
};

export default PickPhase;
