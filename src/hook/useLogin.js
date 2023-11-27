import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../data';

/**
 * useLogin: 로그인 로직을 위한 훅
 * @type {Function}
 * @param {string} location - 로그인 후 경로 이동이 필요하다면 작성.
 * @return {object} email, emailHandler, pw, pwHander, isLoading, loginHander
 */
const useLogin = (location) => {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const emailHandler = ({ target: { value } }) => {
    setEmail(value);
  };

  const pwHander = ({ target: { value } }) => {
    setPw(value);
  };

  const loginHander = async () => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, pw);
      setIsLoading(false);
      navigate(location);
    } catch (error) {
      alert('아이디나 비밀번호가 잘못되었습니다.');
    }
  };

  return { email, emailHandler, pw, pwHander, isLoading, loginHander };
};

export default useLogin;
