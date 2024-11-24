import axios from 'axios';

const localhost = import.meta.env.VITE_SERVERHOST;
const BASE_URL = `${localhost}/api/v1/user`;

interface User {
  user_id: number;
  full_name: string;
  email: string;
  birth_day: Date;
  address: string;
  phone: string;
  school_name: string;
  role: string;
  status: boolean;
}

export const token = localStorage.getItem('token');

const headers = {
  Authorization: `Bearer ${token}`,
};

export const listUser = () => 
  axios.get(`${BASE_URL}/findNoAMIN`, { headers })
    .catch(error => console.error('Error fetching users:', error));

export const createUser = (user: User) => 
  axios.post(`${BASE_URL}/save`, user, { headers })
    .catch(error => console.error('Error creating user:', error));

export const getUser = (user_id: number) => 
  axios.get(`${BASE_URL}/findById`, { params: { user_id }, headers })
    .catch(error => console.error('Error fetching user by ID:', error));

export const updateUser = (user_id: number, user: User) => 
  axios.put(`${BASE_URL}/update`, user, { params: { user_id }, headers })
    .catch(error => console.error('Error updating user:', error));

export const deleteUser = (user_id: number) => 
  axios.delete(`${BASE_URL}/deleteById`, { params: { user_id }, headers })
    .catch(error => console.error('Error deleting user:', error));

export const getUserByEmail = (email: string) => 
  axios.get(`${BASE_URL}/findByEmail`, { params: { email }, headers })
    .catch(error => console.error('Error fetching user by email:', error));
