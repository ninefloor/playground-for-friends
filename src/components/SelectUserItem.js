import styled from 'styled-components';
import { userStyleConfig } from '../data';

const Container = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 136px;
  height: 160px;
  background-image: url(${(props) => userStyleConfig[props.order].image});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  opacity: 0.6;
  &.active {
    opacity: 1;
    transform: translateY(-5%);
    box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.25);
  }
  & > .textBg {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    background: ${(props) => userStyleConfig[props.order].color};
    > .text {
      font-family: 'chaney';
      font-style: 14px;
      color: #fff;
      margin-bottom: 8px;
    }
  }
`;

const SelectUserItem = ({ user, attend, setAttend }) => {
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
      order={order}
    >
      <div className="textBg">
        <span className="text">{username}</span>
      </div>
    </Container>
  );
};

export default SelectUserItem;
