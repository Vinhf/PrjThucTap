import axios from 'axios';

const localhost = import.meta.env.VITE_SERVERHOST
const BASE_URL = localhost+'/api/v1/'; // Thay đổi URL tương ứng với backend của bạn

interface Lesson {
  lessonId: String;
  titleId: number;
  lessonName: String;
  videoLink: String;
}

export const token = localStorage.getItem('token');

export const listCourse = () => axios.get(BASE_URL + '/findAll');

export const getLessonBytitleId= (id: number) =>
  axios.get(BASE_URL + 'lessons/by-title/' + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const creatCourse = (lesson: Lesson) =>
  axios.post(BASE_URL + '/save', lesson, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getTitleById = (titleId: number) =>
  axios.get(BASE_URL + '/getById/' + titleId);
export const updaTitle = (titleId: number, lesson: Lesson) =>
  axios.post(BASE_URL + '/update/' + titleId, lesson, {
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
