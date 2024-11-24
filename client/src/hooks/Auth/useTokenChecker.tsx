// File: /src/hooks/useTokenChecker.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth';

const useTokenChecker = () => {
  const navigate = useNavigate();
  const decodedToken = useAuth();

  const checkToken = () => {
    if (!decodedToken || !decodedToken.exp) {
      return;
    } else {
      const dayEXP = decodedToken.exp * 1000;
      const nowDay = Date.now();

      if (nowDay >= dayEXP && decodedToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/');
        return;
      }
    }
  };

  useEffect(() => {
    checkToken(); 

    const interval = setInterval(
      () => {
        checkToken();
      },
      5 * 60 * 1000,
    ); // 5 phút

    return () => clearInterval(interval); // Dọn dẹp interval khi hook bị unmounted
  }, [decodedToken, navigate]);
};

export default useTokenChecker;
