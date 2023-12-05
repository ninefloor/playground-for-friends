import styled from 'styled-components';
import { CircleBtn } from '../atom';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    90deg,
    rgba(236, 71, 88, 0.3) 0%,
    rgba(26, 123, 185, 0.3) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  position: relative;
  & > .users {
    width: 100%;
    display: flex;
    padding: 0 40px;
    justify-content: space-between;
    align-items: flex-end;
    position: relative;
    > .decisionUsers {
      min-width: 136px;
      display: flex;
      &.draw {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
`;

const PrevBtn = styled(CircleBtn)`
  top: 12px;
  left: 12px;
`;

const VisibleBtn = styled(CircleBtn)`
  top: 12px;
  right: 56px;
`;

const RefreshBtn = styled(CircleBtn)`
  top: 12px;
  right: 12px;
`;

const Graph = styled.div`
  width: 100%;
  height: 8px;
  display: flex;
  transition: opacity 0.2s ease-in-out;
  background-color: #666;
  & > div {
    height: 100%;
    transition: all 0.4s ease-in-out;
  }
  & > .L {
    width: ${({ resultvalue }) =>
      (resultvalue.L / (resultvalue.L + resultvalue.R)) * 100 + '%'};
    background-color: #ec4758;
  }
  & > .R {
    width: ${({ resultvalue }) =>
      (resultvalue.R / (resultvalue.L + resultvalue.R)) * 100 + '%'};
    background-color: #1a7bb9;
  }
`;

const FinalResultContainer = styled.div`
  width: 100%;
  display: flex;
  height: 100%;
  animation: 0.9s ease-in-out contain;
  position: absolute;
  bottom: 0;
  z-index: 1;
  transition: opacity 0.2s ease-in-out;
  overflow: hidden;
  margin-bottom: 8px;
  backdrop-filter: ${({ result }) =>
    result === 'draw' ? 'grayscale(100%)' : 'none'};
  > span {
    margin-top: 12px;
    animation: 0.5s ease-in-out fade;
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 36px;
    font-family: 'chaney';
    font-size: 48px;
    text-shadow: 0px 0px 16px rgba(255, 255, 255, 0.8);
    color: #eee;
    & > span {
      font-size: 200px;
      -webkit-text-stroke: 0;
      text-shadow: 0 0 48px #0000003b;
    }

    &.left {
      -webkit-text-stroke: ${({ result }) =>
        result === 'left' ? '#ec4758 0.6px' : '#646464 0.6px'};
      background: ${({ result }) =>
        result === 'left'
          ? 'linear-gradient(180deg, rgba(236, 71, 88, 0) 0%, rgba(236, 71, 88, 1.1) 100%)'
          : 'linear-gradient(180deg, rgba(100, 100, 100, 0) 0%, rgba(100 , 100, 100, 1.1) 100%)'};
      display: ${({ result }) => result === 'draw' && 'none'};
      backdrop-filter: ${({ result }) =>
        result === 'right' ? 'grayscale(100%)' : ''};
    }
    &.right {
      -webkit-text-stroke: ${({ result }) =>
        result === 'right' ? '#1a7bb9 0.6px' : '#646464 0.6px'};
      background: ${({ result }) =>
        result === 'right'
          ? 'linear-gradient(180deg, rgba(26, 123, 185, 0) 0%, rgba(26, 123, 185, 1.1) 100%)'
          : 'linear-gradient(180deg, rgba(100, 100, 100, 0) 0%, rgba(100 , 100, 100, 1.1) 100%)'};
      display: ${({ result }) => result === 'draw' && 'none'};
      backdrop-filter: ${({ result }) =>
        result === 'left' ? 'grayscale(100%)' : ''};
    }

    &.draw {
      width: 100%;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.85) 100%
      );
      display: ${({ result }) => result !== 'draw' && 'none'};
      color: #444;
    }
  }
  &.hide {
    opacity: 0;
  }
  @keyframes contain {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes fade {
    0% {
      opacity: 0;
      transform: translateY(5%);
    }
    100% {
      opacity: 1;
      transform: translateY(0%);
    }
  }
`;

const ResultCount = styled.div`
  width: 100%;
  display: flex;
  position: absolute;
  top: 16px;
  & > div {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'chaney';
    font-size: 40px;
    text-shadow: 0px 4px 24px rgba(255, 255, 255, 0.2);
    opacity: 0.3;
    &.left {
      left: 46.5%;
      color: #ec4758;
    }
    &.right {
      right: 46.5%;
      color: #1a7bb9;
    }
  }
`;

export {
  Container,
  PrevBtn,
  VisibleBtn,
  RefreshBtn,
  Graph,
  FinalResultContainer,
  ResultCount,
};
