import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../../hooks/Auth/authService';
import { isStrongPassword } from '../../utils/validators';

interface FormData {
  newPassword: string;
}

interface Errors {
  newPassword: boolean;
}

const ChangePassword: React.FC = () => {
  const location = useLocation();
  const dataFrom = location.state?.data;

  const [formData, setFormData] = useState<FormData>({
    newPassword: '',
  });

  const [errors, setErrors] = useState<Errors>({
    newPassword: false,
  });

  const [message, setMessage] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let isValid = isStrongPassword(value);
    setErrors({ ...errors, [name]: !isValid });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isStrongPassword(formData.newPassword)) {
      setMessage('Password is not strong enough. Please try again.');
      return;
    }

    const updatedDataFrom = {
      ...dataFrom,
      data: {
        ...dataFrom.data,
        newPassword: formData.newPassword,
      },
    };

    try {
      await authService.changepass(updatedDataFrom.data);
      setMessage('');
      setSuccess('Password has been successfully changed.');

      // Redirect to login or another appropriate page after password change
      navigate('/protected/home');
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
      console.log(error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center justify-center">
        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="flex mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 justify-center">
              Change Password for Account: {dataFrom?.email}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  New Password:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter your new password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.newPassword && (
                    <p className="text-sm font-medium text-red-500">
                      Password is not strong enough.
                    </p>
                  )}
                </div>
              </div>

              {message && (
                <div className="mb-4 text-center">
                  <p className="text-sm font-medium text-red-500">{message}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 text-center">
                  <p className="text-sm font-medium text-green-500">{success}</p>
                </div>
              )}

              <div className="mb-4">
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-lg border border-primary p-4 text-white transition hover:bg-opacity-90 bg-primary"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
