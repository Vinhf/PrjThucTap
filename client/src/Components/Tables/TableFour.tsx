import React, {useEffect, useState} from 'react'
import { createReview, getReview, updateReview } from '../../services/ReviewGetAll';
import { useNavigate, useParams } from 'react-router-dom';

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
const TableFour = () => {
    const [review, setReview] = useState<ReviewInput>({
      review_id: 1,
      comment: '',
      create_date: new Date,
      rating: 1,
      course_id: 1,
      user_id: 1
    });
    const [errors, setErrors] = useState({
      review_id: '',
      comment: '',
      create_date: '',
      rating: '',
      course_id: '',
      user_id: ''
    });
    const { review_id } = useParams<{ review_id: string }>();
    const navigate = useNavigate();
    useEffect(() => {
      if (review_id) {
        const numericReviewId = Number(review_id);
        getReview(numericReviewId).then((response) => {
          setReview(response.data);
        }).catch(error => {
          console.error(error);
        });
      }
    }, [review_id]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const parsedValue = name === 'create_date' ? new Date(value) : (isNaN(Number(value)) ? value : Number(value));
      setReview({ ...review, [name]: parsedValue });
    };
  
    const saveOrUpdateReview = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (validateForm()) {
        if (review_id) {
          const numericReviewId = Number(review_id);
          updateReview(numericReviewId, review).then((response) => {
            console.log(response.data);
            navigate('/review');
          }).catch(error => {
            console.error(error);
          });
        }
        else {
          createReview(review).then((response) => {
            console.log(response.data);
            navigate('/review');
          }).catch(error => {
            console.error(error);
          });
        }
      }
    };
    const validateForm = () => {
      let valid = true;
      const errorsCopy = { ...errors };
      Object.keys(review).forEach((key) => {
        if (typeof review[key as keyof typeof review] === 'string') {
          const value = review[key as keyof typeof review] as string;
          if (value.trim() === '') {
            errorsCopy[key as keyof typeof review] = `${key.replace('_', ' ')} is required`;
            valid = false;
          }
        }
      });
      setErrors(errorsCopy);
      return valid;
    };
    const renderTitle = () => {
      return review_id ? <h2 className="text-center">Update Review</h2> : <h2 className="text-center">Add Review</h2>;
    };
  
    return (
      <div className="container">
        <br /><br />
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            {renderTitle()}
            <div className="card-body">
              <form onSubmit={saveOrUpdateReview}>
                {Object.keys(review).map((key) => (
                  <div className="form-group mb-2" key={key}>
                    <label className="form-label">{key.replace('_', ' ')}:</label>
                    <input
                      type={key.includes('Date') ? 'date' : 'text'}
                      placeholder={`Enter ${key.replace('_', ' ')}`}
                      name={key}
                      className={`form-control ${errors[key as keyof typeof errors] ? 'is-invalid' : ''}`}
                      value={review[key as keyof typeof review] as string}
                      onChange={handleInputChange}
                    />
                    {errors[key as keyof typeof errors] && <div className="invalid-feedback">{errors[key as keyof typeof errors]}</div>}
                  </div>
                ))}
                <button className="btn btn-success" type="submit">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default TableFour;