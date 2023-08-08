import styled from 'styled-components';

const Container = styled.button`
  width: 96px;
  height: 120px;
  background-color: #ccc;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &.active {
    background-color: #eee;
    transform: scale(101%) translateY(-5%);
  }
`;

const User = ({ user, attend, setAttend }) => {
  const { username, order } = user;

  const clickHandler = () => {
    setAttend((prev) => {
      if (prev.map((el) => el.order).includes(order))
        return prev.filter((el) => el.order !== order);
      else return [...prev, user];
    });
  };
  return (
    <Container
      onClick={clickHandler}
      className={attend.map((el) => el.order).includes(order) ? 'active' : ''}
    >
      {username}
    </Container>
  );
};

export default User;
