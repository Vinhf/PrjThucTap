import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../../hooks/Auth/authService';


const OTPInput: React.FC = () => {
  const location = useLocation();
 
  const [code, setCode] = useState('');
  const  dataFrom  = location.state || {
    data: {
      full_name: '',
      email: '',
      password: '',
      sex: '',
      birthDay: '',
      address: '',
      phone: '',
      school_name: '',
      role: '',
    },
  };
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Create a copy of dataFrom to update immutably
    const updatedDataFrom = {
      ...dataFrom,
      data: {
        ...dataFrom.data,
        code: code,
      },
    };
    console.log("dữ liệu của updatedDataFrom:", updatedDataFrom);
    try {
      const response = await authService.register(updatedDataFrom);
      console.log("Response from authService.register:", response);
      setError('');
  
      if (response.data !== null) {
        navigate('/');
      } else {
        setError('Mã OTP không chính xác. Vui lòng thử lại.');
      }
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      console.log(error)
      console.log(updatedDataFrom)
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
                    onChange={handleChange}
                    placeholder="Enter your OTP code"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
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

              <div className="flex items-center justify-center">
              
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPInput;
