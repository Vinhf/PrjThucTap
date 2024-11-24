import React, { useEffect, useState } from 'react';
import { createUser, getUser, updateUser } from '../../services/UserGetAll';
import { useNavigate, useParams } from 'react-router-dom';

interface UserInput {
  full_name: string;
  email: string;
  password: string;
  sex: string;
  birth_day: Date | string;
  address: string;
  phone: string;
  school_name: string;
  create_date: Date | string;
  role: string;
  status: boolean;
  avt?: File | null; 
}

const TableThree = () => {
  
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserInput>({
    full_name: '',
    email: '',
    password: "*************",
    sex: '',
    birth_day: '',
    address: '',
    phone: '',
    school_name: '',
    create_date: new Date().toISOString().split('T')[0],
    role: 'STUDENT', // Default role
    status: true,
    
  });

  const [errors, setErrors] = useState({
    full_name: '',
    email: '',
    password: '',
    sex: '',
    birth_day: '',
    address: '',
    phone: '',
    school_name: '',
    create_date: '',
    role: '',
    status: '',
  });

  console.log("test user: " + userId);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      const numericUserId = Number(userId);
      getUser(numericUserId)
        .then((response) => {
          const userData = response.data;
          console.log("test: "+ userData);
          userData.birth_day =new  Date(userData.birth_day)
            .toISOString()
            .split('T')[0];
          userData.create_date = new Date(userData.create_date)
            .toISOString()
            .split('T')[0];
          setUser(userData);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const parsedValue =
      name === 'status'
        ? Boolean(value)
        : name === 'birth_day' || name === 'create_date'
          ? value
          : value;
    setUser({ ...user, [name]: parsedValue });
  };

  const saveOrUpdateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      if (userId) {
        const numericUserId = Number(userId);
        updateUser(numericUserId, user)
          .then((response) => {
            console.log(response.data);
            navigate('/user');
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        createUser(user)
          .then((response) => {
            console.log(response.data);
            navigate('/user');
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    const errorsCopy = { ...errors };
    Object.keys(user).forEach((key) => {
      const value = user[key as keyof typeof user];
      if (typeof value === 'string' && value.trim() === '') {
        errorsCopy[key as keyof typeof errors] =
          `${key.replace('_', ' ')} is required`;
        valid = false;
      } else if (key === 'birth_day' || key === 'create_date') {
        if (new Date(value).toString() === 'Invalid Date') {
          errorsCopy[key as keyof typeof errors] =
            `Invalid ${key.replace('_', ' ')}`;
          valid = false;
        }
      }
    });
    setErrors(errorsCopy);
    return valid;
  };

  const renderTitle = () => {
    return userId ? (
      <h2 className="text-center">Update User</h2>
    ) : (
      <h2 className="text-center justify-between " >Add User</h2>
    );
  };

  return (
    <div className="container">
      <br />
      <br />
      <div className="row">
        <div className="card col-md-6 offset-md-3 offset-md-3">
          {renderTitle()}
          <div className="card-body">
            <form onSubmit={saveOrUpdateUser}>
              <div className="grid grid-cols-5 gap-8">
                <div className="col-span-5 xl:col-span-3">
                  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                      <h3 className="font-medium text-black dark:text-white">
                        User Information
                      </h3>
                    </div>
                    <div className="p-7">
                      {Object.keys(user).map((key) =>
                        key !== 'role' && key !== 'userId' ? (
                          <div className="mb-4" key={key}>
                            <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">
                              {key.replace('_', ' ')}:
                            </label>
                            <input
                              type={
                                key === 'birth_day' || key === 'create_date'
                                  ? 'date'
                                  : key === 'password'
                                  ? 'password'
                                  : 'text'
                              }
                              placeholder={`Enter ${key.replace('_', ' ')}`}
                              name={key}
                              className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors[key as keyof typeof errors] ? 'border-red-500' : ''}`}
                              value={user[key as keyof typeof user] as string}
                              onChange={handleInputChange}
                            />
                            {errors[key as keyof typeof errors] && (
                              <p className="text-red-500 text-xs italic">
                                {errors[key as keyof typeof errors]}
                              </p>
                            )}
                          </div>
                        ) : key === 'role' ? (
                          <div className="mb-4" key={key}>
                            <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-white">
                              {key.replace('_', ' ')}:
                            </label>
                            <select
                              name={key}
                              className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${errors[key as keyof typeof errors] ? 'border-red-500' : ''}`}
                              value={user[key as keyof typeof user] as string}
                              onChange={handleInputChange}
                            >
                              <option value="STUDENT">STUDENT</option>
                              <option value="INSTRUCTOR">INSTRUCTOR</option>
                            </select>
                            {errors[key as keyof typeof errors] && (
                              <p className="text-red-500 text-xs italic">
                                {errors[key as keyof typeof errors]}
                              </p>
                            )}
                          </div>
                        ) : null
                      )}

                      <button className="inline-flex items-center justify-center rounded-md border border-primary bg-primary p-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                        Submit
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-primary bg-primary p-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                        onClick={() => navigate('/user')}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default TableThree;
