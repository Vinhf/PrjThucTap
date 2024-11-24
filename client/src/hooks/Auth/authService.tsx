import axios from 'axios';
import { verify } from 'jsonwebtoken';
const cloudServer = import.meta.env.VITE_SERVERHOST;
const API_URL = cloudServer+'/api/v1/auth';

const authService = {
  register: async (data: any): Promise<any> => {
    try {
      const response = await axios.post<any>(`${API_URL}/register`, data);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  login: async (data: any): Promise<any> => {
    try {
      const response = await axios.post<any>(`${API_URL}/authenticate`, data);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  logout: async (): Promise<void> => {
    try {
      await axios.post(`${API_URL}/logout`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      localStorage.removeItem("role");
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      throw error;
    }
  },
  verify: async (data: any): Promise<any> => {
    try {
      const response = await axios.post<any>(`${API_URL}/verify`, data);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  payment: async (data: any): Promise<any> => {
    try {
      const response = await axios.post<any>(`${API_URL}/transfer`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  changepass: async (data: any): Promise<any> => {
    try {
      const response = await axios.post<any>(`${API_URL}/changepass`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

};

export default authService;
