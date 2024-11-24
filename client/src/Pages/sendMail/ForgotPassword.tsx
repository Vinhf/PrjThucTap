import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ValidationIcon from '../../Components/ValidationIcon';
import axios from 'axios';

interface FormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '' });
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setMessage('Please enter your email.');
      return;
    }

    setIsSending(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVERHOST+'/api/v1/auth/mail/send/forgotpassword',
        formData,
      );

      if (response.status === 200) {
        setMessage('OTP sent successfully.');
        navigate('/auth/forgotpassword/sendotp', { state: { data: formData } });
      } else {
        setMessage('Unexpected response status: ' + response.status);
      }

      setTimeout(() => {
        setIsSending(false);
      }, 60000);
    } catch (error: any) {
      console.error(error);

      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          setMessage('Email not found.');
        } else {
          setMessage('Failed to send OTP. Please try again.');
        }
      } else {
        setMessage('Failed to send OTP. Please try again.');
      }

      setIsSending(false);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center justify-center">
        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="flex mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 justify-center">
              Forgot Password
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your Email to receive your verification code"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ValidationIcon isValid={true} />
                </div>
              </div>

              <div className="mb-4">
                <button
                  type="submit"
                  className={`w-full cursor-pointer rounded-lg border border-primary p-4 text-white transition hover:bg-opacity-90 ${
                    isSending ? 'bg-gray-400 pointer-events-none' : 'bg-primary'
                  }`}
                  disabled={isSending}
                >
                  {isSending ? 'Sending...' : 'Send OTP'}
                </button>
              </div>

              <div className="flex items-center justify-center">
                <p className="text-sm font-medium text-black dark:text-white">
                  Remember your password?{' '}
                  <Link to="/auth/signin" className="text-primary hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>

              {message && (
                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-red-500">{message}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
