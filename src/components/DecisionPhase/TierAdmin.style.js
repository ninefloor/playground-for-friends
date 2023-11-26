import styled from 'styled-components';
import { CircleBtn } from '../atom';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  & > .selectedUser {
    width: 100%;
    max-width: 560px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: 16px 0;
    > .selectedTitle {
      padding-left: 8px;
      padding-bottom: 8px;
      font-family: 'chaney';
      font-size: 32px;
      text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.2);
    }
  }
  & > .users {
    width: 100%;
    max-width: 560px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
    > .decisionUsers {
      min-width: 136px;
      display: flex;
      flex-direction: column;
    }
  }
`;

const PrevBtn = styled(CircleBtn)`
  bottom: 20px;
  right: 60px;
`;

const VisibleBtn = styled(CircleBtn)`
  bottom: 20px;
  right: 56px;
`;

const RefreshBtn = styled(CircleBtn)`
  bottom: 20px;
  right: 12px;
`;

export { Container, PrevBtn, RefreshBtn };
