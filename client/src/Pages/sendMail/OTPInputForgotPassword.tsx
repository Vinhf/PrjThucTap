import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../../hooks/Auth/authService';
import { isStrongPassword } from '../../utils/validators';

const OTPInputForgotPassword: React.FC = () => {
  const location = useLocation();

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const dataFrom = location.state || {
    data: {
      email: '',
    },
  };

  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);

    if (!isStrongPassword(value)) {
      setPasswordError('Password is not strong enough.');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isStrongPassword(newPassword)) {
      setPasswordError('Password is not strong enough.');
      return;
    }

    const updatedDataFrom = {
      ...dataFrom,
      data: {
        ...dataFrom.data,
        code: code,
        newPassword: newPassword,
      },
    };

    try {
      const response = await authService.verify(updatedDataFrom);
      setError('');

      if (response.data !== null) {
        navigate('/protected/home');
      } else {
        setError('Mã OTP không chính xác. Vui lòng thử lại.');
      }
    } catch (error) {
      setError('Mã OTP không chính xác. Vui lòng thử lại.');
      console.log(error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center justify-center">
        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="flex mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 justify-center">
              Xác nhận mã OTP
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Nhập mã OTP:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="otp"
                    value={code}
                    onChange={handleCodeChange}
                    placeholder="Enter your OTP code"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  New Password:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {passwordError && (
                    <p className="text-sm font-medium text-red-500">
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <div className="mb-4 text-center">
                  <p className="text-sm font-medium text-red-500">{error}</p>
                </div>
              )}

              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-lg border border-primary p-4 text-white transition hover:bg-opacity-90 bg-primary"
                >
                  Xác nhận
                </button>
              </div>

              <div className="flex items-center justify-center"></div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPInputForgotPassword;
