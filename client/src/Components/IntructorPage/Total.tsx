import { Box, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

interface TotalStepProps {
  onComplete: () => void;
}

const Total: React.FC<TotalStepProps> = ({ onComplete }) => {
  const [courseData, setCourseData] = useState(() => {
    const savedData = sessionStorage.getItem('courseData');
    return savedData
      ? JSON.parse(savedData)
      : {
          course_id: '',
          courseTitle: '',
          shortDescription: '',
          sections: [],
          video: '',
          poster: '',
          price: '',
          coupon: '',
        };
  });
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async () => {
    try {
      let response;
      console.log(courseData.course_id);
      const token = localStorage.getItem('token');
      if (courseData.course_id) {
        // Update existing course
        console.log('đã vào đây');
        response = await axios.put(
          import.meta.env.VITE_SERVERHOST+ `/api/v1/courses/${courseData.course_id}`,
          courseData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        // Create new course
        response = await axios.post(
           import.meta.env.VITE_SERVERHOST+'/api/v1/courses/add',
          courseData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }
      console.log('Course processed successfully:', response.data);
      sessionStorage.removeItem('courseData');
      onComplete();
      const data = response.data;
      navigate('/TableCourse', { state: { data } });
    } catch (error) {
      console.error('Error processing course:', error);
      toast.error('Error processing course');
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Course Summary</Typography>
      <Typography variant="body1">
        Course Title: {courseData.courseTitle}
      </Typography>
      <Typography variant="body1">
        Short Description: {courseData.shortDescription}
      </Typography>
      <Typography variant="body1">
        Number of Sections: {courseData.sections.length}
      </Typography>
      <Typography variant="body1">Price: {courseData.price}</Typography>
      <Typography variant="body1">Coupon: {courseData.coupon}</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        Finish
      </Button>
      <ToastContainer />
    </Box>
  );
};

export default Total;
