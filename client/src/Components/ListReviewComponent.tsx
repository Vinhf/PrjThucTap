import React, { useEffect, useState } from 'react';
import { deleteReview, listReview } from '../services/ReviewGetAll';
import { useNavigate } from 'react-router-dom';

interface Review {
    review_id: number;
    comment: string;
    create_date: Date;
    rating: number;
    course_id: number;
    user_id: number;
}
interface ReviewInput {
    review_id: number;
    comment: string;
    create_date: Date;
    rating: number;
    course_id: number;
    user_id: number;
}
const ListReviewComponent = () => {
    const [review, setReview] = useState<any[]>([]);
    const navigator = useNavigate();
    useEffect(() => {
        getAllReview();
    }, []);
    function getAllReview() {
        listReview().then((response) => {
            setReview(response.data);
        }).catch(error => {
            console.error(error);
        });
    }
    function addNewReview() {
        navigator('/add-review');
    }
    function updateReview(review_id: number) {
        navigator(`/edit-review/${review_id}`);
    }
    function removeReview(review_id: number) {
        console.log(review_id);
        deleteReview(review_id).then((response) => {
            getAllReview();
        }).catch(error => {
            console.error(error);
        });
    }
    return (
        <div className='container'>
            <div className="max-w-full overflow-x-auto">
                <h2 className='text-center'>List of Review</h2>
                <button className='btn btn-primary mb-2' onClick={addNewReview}>Add Review</button>
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">ID</th>
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Comment</th>
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Create Date</th>
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Rating</th>
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Course ID</th>
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">User ID</th>
                            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        review.map(review => 
                        <tr key={review.review_id}>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">{review.review_id}</p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">{review.comment}</p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">{review.create_date}</p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">{review.rating}</p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">{review.course_id}</p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <p className="text-black dark:text-white">{review.user_id}</p>
                            </td>
                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                <button className="btn btn-info" onClick={() => updateReview(review.review_id)}>Update</button>
                                <button className="btn btn-danger" onClick={() => deleteReview(review.review_id)}
                                style={{marginLeft: '10px'}}
                                >Delete</button>
                            </td>
                        </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListReviewComponent;