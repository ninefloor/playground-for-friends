import styled from 'styled-components';
import { userStyleConfig } from '../../data';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
`;

export const User = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transition: all 0.2s ease-in-out;
  animation: 0.4s ease-in-out fade;
  & .decisionBtn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    opacity: 0;
    transition: all 0.2s ease-in-out;
    position: relative;
    & .btn {
      opacity: 0;
      width: 50%;
      height: 48px;
      color: #fff;
      font-family: 'chaney';
      font-size: 36px;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      &.L {
        background: linear-gradient(
          180deg,
          rgba(236, 71, 88, 0) 0%,
          #ec4758 100%
        );
        opacity: 0.5;
        &:hover {
          opacity: 1;
        }
      }
      &.R {
        background: linear-gradient(
          180deg,
          rgba(26, 123, 185, 0) 0%,
          #1a7bb9 100%
        );
        opacity: 0.5;
        &:hover {
          opacity: 1;
        }
      }
      &.giveup {
        position: absolute;
        width: 100%;
        height: 32px;
        bottom: -32px;
        font-size: 14px;
        background: linear-gradient(
          180deg,
          rgba(120, 120, 120, 0.6) 0%,
          rgba(0, 0, 0, 0) 100%
        );
        opacity: 0.7;
        &:hover {
          opacity: 1;
        }
      }
    }
  }
  &:hover {
    & .decisionBtn {
      opacity: 1;
    }
    & .userImage {
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)),
        url(${(props) => userStyleConfig[props.order].image});
      background-size: cover;
      background-position: center;
    }
  }
  & > .decision {
    cursor: default;
    background: ${({ picks, username }) => {
      if (picks[username] === 'L')
        return 'linear-gradient(180deg, rgba(236, 71, 88, 0) 30%, rgba(236, 71, 88, 0.07) 90%)';
      if (picks[username] === 'R')
        return 'linear-gradient(180deg, rgba(26, 123, 185, 0) 30%, rgba(26, 123, 185, 0.07) 90%)';
      if (picks[username] === 'giveup')
        return 'linear-gradient(180deg, rgba(100, 100, 100, 0) 30%, rgba(100, 100, 100, 0.07) 90%)';
    }};

    & > .decisionChosen {
      opacity: ${({ picks, username }) =>
        picks[username] === 'giveup' ? '0.8' : '1'};
      color: ${({ picks, username }) =>
        picks[username] === 'L' ? '#EC4758' : '#1a7bb9'};
      text-shadow: ${({ picks, username }) =>
        `0 0 12px ${
          picks[username] === 'L'
            ? 'rgba(236, 71, 88, 0.4)'
            : 'rgba(26, 123, 185, 0.4)'
        }`};
      text-align: center;
      font-family: 'chaney';
      font-size: 72px;
      animation: 0.3s ease-in-out fade;
    }
  }

  & > .userImage {
    width: 128px;
    height: 160px;
    background: url(${(props) => userStyleConfig[props.order].image});
    background-size: cover;
    background-position: center;
    transition: background 0.7s ease-in-out;
  }
  & > .textBg {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    background: ${(props) => userStyleConfig[props.order].color};
    opacity: 0.5;
  }
  & > .text {
    position: absolute;
    bottom: 0;
    right: 12px;
    cursor: pointer;
    font-family: 'chaney';
    font-style: 14px;
    color: #fff;
    margin-bottom: 8px;
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
