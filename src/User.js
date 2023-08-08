import styled from 'styled-components';

const Container = styled.div`
  width: 96px;
  height: 120px;
  background-color: ${(props) => (props.attend ? '#eee' : '#ccc')};
  cursor: pointer;
`;

const User = ({ user, attend, setAttend }) => {
  const { username } = user;

  const clickHandler = () => {
    setAttend((prev) => {
      if (prev.includes(username)) return prev.filter((el) => el !== username);
      else return [...prev, username];
    });
  };
  return (
    <button onClick={clickHandler}>
      <Container attend={attend.includes(username)}>{username}</Container>
    </button>
  );
};

export default User;
