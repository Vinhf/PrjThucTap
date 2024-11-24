import axios from 'axios';

const localhost = import.meta.env.VITE_SERVERHOST
const BASE_URL = localhost+'/api/v1/'; // Thay đổi URL tương ứng với backend của bạn

interface Title {
  titleId: String;
  courseId: String;
  titleName: String;
  passed: Boolean;
}

export const token = localStorage.getItem('token');

export const listCourse = () => axios.get(BASE_URL + '/findAll');

export const getTitleByCourseId = (id: String) =>
  axios.get(BASE_URL + '/auth/titles/getByCourseId/' + id);

export const creatCourse = (title: Title) =>
  axios.post(BASE_URL + '/save', title, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getTitleById = (titleId: number) =>
  axios.get(BASE_URL + '/getById/' + titleId);
export const updaTitle = (titleId: number, title: Title) =>
  axios.post(BASE_URL + '/update/' + titleId, title, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const deletCourse = (titleId: number) =>
  axios.delete(BASE_URL + '/' + titleId, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
