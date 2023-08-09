import styled from 'styled-components';
import {
  nine,
  doubl3b,
  sunny,
  kimpirya,
  jyuani,
  ryang,
  sike,
} from '../asset/images';

const userStyleConfig = {
  1: {
    image: ryang,
    color: 'linear-gradient(180deg, rgba(46, 125, 50, 0.00) 0%, #2E7D32 100%)',
  },
  2: {
    image: kimpirya,
    color: 'linear-gradient(180deg, rgba(16, 0, 231, 0.00) 0%, #1000E7 100%);;',
  },
  3: {
    image: sike,
    color: 'linear-gradient(180deg, rgba(94, 63, 181, 0.00) 0%, #5E3FB5 100%);',
  },
  4: {
    image: sunny,
    color:
      'linear-gradient(180deg, rgba(123, 31, 162, 0.00) 0%, #7B1FA2 100%);',
  },
  5: {
    image: jyuani,
    color:
      'linear-gradient(180deg, rgba(244, 143, 177, 0.00) 0%, #F48FB1 100%);',
  },
  6: {
    image: nine,
    color: 'linear-gradient(180deg, rgba(30, 30, 30, 0.00) 0%, #1E1E1E 100%);',
  },
  7: {
    image: doubl3b,
    color: 'linear-gradient(180deg, rgba(183, 28, 28, 0.00) 0%, #B71C1C 100%);',
  },
};

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
