import axios from 'axios';

const a = process.env.

const BASE_URL = a + 'api/v1/auth/review';

interface Review {
    review_id: number;
    comment: string;
    create_date: Date;
    rating: number;
    course_id: number;
    user_id: number;
}

export const listReview = () => axios.get(BASE_URL + '/findAll');
export const createReview = (review: Review) => axios.post(BASE_URL + '/save', review);
export const getReview = (review_id: number) => axios.get(BASE_URL + '/findById/' + review_id);
export const updateReview = (review_id: number, review: Review) => axios.post(BASE_URL + '/update/' + review_id, review);
export const deleteReview = (review_id: number) => axios.delete(BASE_URL + '/' + review_id);