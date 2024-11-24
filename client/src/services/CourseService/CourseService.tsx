import axios from 'axios';
import { useEmail } from '../../utils/auth';

const localhost = import.meta.env.VITE_SERVERHOST;
const BASE_URL = localhost + '/api/v1/'; // Thay đổi URL tương ứng với backend của bạn

interface Course {
  courseId: number;
  userId: number;
  categoryId: number;
  courseName: String;
  description: String;
  videoLink: String;
  imgLink: String;
  updateDate: String;
  status: String;
  price: String;
}

export const token = localStorage.getItem('token');

export const listCourse = () => axios.get(BASE_URL + 'auth/courses/all');
export const creatCourse = (course: Course) =>
  axios.post(BASE_URL + '/save', course, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const getCourseById = (course_id: String) =>
  axios.get(BASE_URL + 'auth/courses/' + course_id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const updaCourse = (course_id: number, course: Course) =>
  axios.post(BASE_URL + 'courses/' + course_id, course, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const deletCourse = (course_id: String) =>
  axios.delete(BASE_URL + 'courses/' + course_id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const getCourseByEmail = (Email: String) =>
  axios.get(BASE_URL + 'courses/by-email/' + Email, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const banCourse = (course_id: String, status: String) =>
  axios.put(BASE_URL + `courses/${course_id}/status`, {
    params: { status },
    headers: { Authorization: `Bearer ${token}` },
  });
export const getSessionDataById = (course_id: String) =>
  axios.get(BASE_URL + 'courses/session/' + course_id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const getAllCart = (email: String) =>
  axios.get(BASE_URL + 'auth/orders/show', {
    params: { email },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const getAllWishlist = (email: String) =>
  axios.get(BASE_URL + 'auth/wishlist/show', {
    params: { email },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const removeSelectedCourses = (
  selectedCourses: { email: string | null; courseId: number }[],
) =>
  axios.post(BASE_URL + 'auth/orders/remove', selectedCourses, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getBalance = (email: string) =>
  axios.get(BASE_URL + 'auth/balance', {
    params: { email },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const buyCourses = (courses: any[]) =>
  axios.post(BASE_URL + 'auth/payment-courses/pay/multiple', courses, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const removeCoursesAfterPurchase = (courses: any[]) =>
  axios.post(BASE_URL + 'auth/orders/remove', courses, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const removeCourseFromWishlist = (email: string, courseId: number) =>
  axios.post(
    BASE_URL + 'auth/wishlist/remove',
    {
      email,
      courseId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
export const addCourseToCart = (email: string, courseId: number) =>
  axios.post(
    BASE_URL + 'auth/orders/add',
    {
      email,
      courseId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
