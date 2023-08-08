import styled from 'styled-components';

const Container = styled.div`
  width: 96px;
  height: 120px;
  background-color: #ccc;
  cursor: pointer;
  &.active {
    background-color: #eee;
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
    <button onClick={clickHandler}>
      <Container
        className={attend.map((el) => el.order).includes(order) ? 'active' : ''}
      >
        {username}
      </Container>
    </button>
  );
};

export default User;
