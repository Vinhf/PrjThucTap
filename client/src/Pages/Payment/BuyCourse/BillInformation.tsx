import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useEmail } from '../../../utils/auth';
import axios from 'axios';
import {
  getBalance,
  buyCourses,
  removeCoursesAfterPurchase,
} from '../../../services/CourseService/CourseService';

import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  CardMedia,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';

const BillInformation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const courses = location.state?.courses || [];
  const coursess = location.state?.coursess || [];
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userEmail = useEmail();

  useEffect(() => {
  const fetchWalletData = async () => {
    setLoading(true);
    setError(null);

    try {
        if (!userEmail) {
            throw new Error('User email not found');
        }
        const balanceResponse = await getBalance(userEmail);
setBalance(balanceResponse.data);
} catch (error) {
  console.error('Error fetching wallet data:', error);
  setError('Error fetching wallet data');
} finally {
  setLoading(false);
}
    };
    if (userEmail) {
      fetchWalletData();
  }
}, [userEmail]);



  const totalAmount = courses.reduce(
    (sum, course) => sum + parseFloat(course.amount),
    0,
  );

  const handleSubmitBuy = async () => {
    try {
      if (coursess) {
        const response = await buyCourses(courses);
        if (response.status === 200) {
          if (coursess.length > 0) {
            await removeCoursesAfterPurchase(coursess);
          }
          toast.success('Successfully purchased the selected courses!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate('/detailpage/buy/success');
        } else {
          toast.error('Failed to purchase courses', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } else {
        toast.error('No courses selected for purchase', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error buying courses:', error);
      toast.error('Failed to purchase courses', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  

  return (
    <div>
      <div className="container mx-auto py-12 ">
        <Typography variant="h4" gutterBottom>
          Bill Information
        </Typography>
        <div className="bg-white py-6 shadow-md shadow-default dark:border-strokedark dark:bg-boxdark">
        <Box
        sx={{ textAlign: 'left', mt: 4, ml: 2 }}
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap={4}
          mb={4}
          
        >
          
            {courses.map((course) => (
              <Card
                key={course.courseId}
                sx={{ display: 'flex', maxWidth: 345 }}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 'auto' }}
                  image={course.imgLink}
                  alt={course.courseName}
                  className="h-55"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography variant="h6">{course.courseName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price:{' '}
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(parseFloat(course.amount))}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            ))}
          
        </Box>
        <Divider />
        <Box sx={{ textAlign: 'left', mt: 4, ml: 2 }}> 
        <Typography variant="h6" gutterBottom mt={4}>
          <strong>Payment Method:</strong> Pay with Wallet Balance
        </Typography>
        <Typography variant="h6" gutterBottom mt={4}>
          <strong>My Balance:</strong> {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(balance)}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Total:{' '}
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(totalAmount)}
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitBuy}
          style={{ marginTop: '20px' }}
        > 
        {balance >= totalAmount ? (
          <p className="text-center text-gray-600">Submit Buy</p>) : ( <p className="text-center text-gray-600">Your balance is insufficient!!!</p>)}
        </Button> 
     
        </Box>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default BillInformation;
