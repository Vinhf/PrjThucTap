import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  validationFullname,
  isValidEmail,
  isStrongPassword,
  validationPhone,
  validationSelection,
} from '../../utils/validators';
import ValidationIcon from '../../Components/ValidationIcon';
import axios from 'axios';
const gender = ['Male', 'Female'];
const role = ['STUDENT', 'INSTRUCTOR'];

interface FormData {
  full_name: string;
  email: string;
  password: string;
  sex: string;
  birthDay: string;
  address: string;
  phone: string;
  school_name: string;
  role: string;
}

interface Errors {
  full_name: boolean;
  email: boolean;
  password: boolean;
  phone: boolean;
  sex: boolean;
  role: boolean;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    password: '',
    sex: '',
    birthDay: '',
    address: '',
    phone: '',
    school_name: '',
    role: '',
  });
  const [errors, setErrors] = useState<Errors>({
    full_name: false,
    email: false,
    password: false,
    phone: false,
    sex: false,
    role: false,
  });

  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Perform validation for specific fields and update errors state
    let isValid = true;
    switch (name) {
      case 'full_name':
        isValid = validationFullname(value);
        break;
      case 'email':
        isValid = isValidEmail(value);
        break;
      case 'password':
        isValid = isStrongPassword(value);
        break;
      case 'phone':
        isValid = validationPhone(value);
        break;
      case 'sex':
        isValid = validationSelection(value);
        break;
      case 'role':
        isValid = validationSelection(value);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: !isValid }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVERHOST+'/api/v1/auth/mail/send/signup',
        formData,
      );
      console.log(response); // In ra phản hồi từ máy chủ để xem chi tiết
      if (response.status === 200) {
        navigate('/auth/signup/sendmail', { state: { data: formData } });
      } 
      else if(response.status === 409) {
        setMessage('Email already exists');
      }
      else {
        setMessage('Unexpected response status: ' + response.status);
      }

    } catch (error: any) {
      console.error(error); // In ra lỗi để xem chi tiết
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response); // In ra phản hồi lỗi từ máy chủ để xem chi tiết
        if (error.response.status === 409) {
          setMessage('Email already exists');
        } else {
          setMessage('Registration failed. Please try again.');
        }
      } else {
        console.error(error);
        setMessage('Registration failed. Please try again.');
      }
    }
    };

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: Errors = {
      full_name: !validationFullname(formData.full_name),
      email: !isValidEmail(formData.email),
      password: !isStrongPassword(formData.password),
      phone: !validationPhone(formData.phone),
      sex: !validationSelection(formData.sex),
      role: !validationSelection(formData.role),
    };

    setErrors(newErrors);
    valid = Object.values(newErrors).every((error) => !error);
    return valid;
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center justify-center">
        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="flex mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 justify-center">
              Sign Up
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ValidationIcon isValid={!errors.full_name} />
                </div>
              </div>

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
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ValidationIcon isValid={!errors.email} />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ValidationIcon isValid={!errors.password} />
                </div>
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Phone
                </label>
                <div className="relative">
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter your phone number"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ValidationIcon isValid={!errors.phone} />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Gender
                </label>
                <div className="relative">
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Select your gender</option>
                    {gender.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ValidationIcon isValid={!errors.sex} />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Role
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Select your role</option>
                    {role.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ValidationIcon isValid={!errors.role} />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Birthday
                </label>
                <input
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleChange}
                  type="date"
                  placeholder="Enter your date of birth"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  School Name
                </label>
                <input
                  name="school_name"
                  value={formData.school_name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your school name"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Address
                </label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your address"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Sign Up"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>

              <div className="flex items-center justify-center">
                <p className="text-sm font-medium text-black dark:text-white">
                  Already have an account?{' '}
                  <Link
                    to="/auth/signin"
                    className="text-primary hover:underline"
                  >
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

export default SignUp;
