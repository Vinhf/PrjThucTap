import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { CardMedia, Grid  } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEmail } from '../../../utils/auth';
import { getCourseById } from '../../../services/CourseService/CourseService';
import axios from 'axios';

interface PaymentParams {
  courseId: string;
  courseName: string;
  userId: string;
  description: String;
  imgLink: String;
  categoryId: string;
  price: string;
}

interface PaymentData {
  emailRequest: string;
  courseId: string;
  amount: string;
  instructorID: string;
}

const DetailPaymentCourse: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<PaymentParams | null>(null);
  const [fullName, setFullName] = useState<string>('');
  const [fullNameStudent, setFullNameStudent] = useState<string>('');
  const [fullNameCategory, setFullNameCategory] = useState<string>('');
  const userEmail = useEmail(); // Email of the student
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const courseResponse = await getCourseById(id);
          setCourse(courseResponse.data);
          // Fetch full name of the instructor
          if (courseResponse.data.userId) {
            try {
              const fullNameResponse = await axios.get(import.meta.env.VITE_SERVERHOST+'/api/v1/auth/userfullname', {
                params: { userId: courseResponse.data.userId },
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              });
              setFullName(fullNameResponse.data);
            } catch (error) {
              console.error('Failed to fetch instructor full name', error);
            }
          }

          // Fetch full name of the student
          if (userEmail) {
            try {
              const fullNameStudentResponse = await axios.get(import.meta.env.VITE_SERVERHOST+'/api/v1/auth/userfullnamestudent', {
                params: { email: userEmail },
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              });
              setFullNameStudent(fullNameStudentResponse.data);
            } catch (error) {
              console.error('Failed to fetch student full name', error);
            }
          }

          // Fetch full name of the category
          if (courseResponse.data.categoryId) {
            try {
              const fullNameCategoryResponse = await axios.get(import.meta.env.VITE_SERVERHOST+'/api/v1/auth/categoryfullname', {
                params: { categoryId: courseResponse.data.categoryId },
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              });
              setFullNameCategory(fullNameCategoryResponse.data);
            } catch (error) {
              console.error('Failed to fetch category full name', error);
            }
          }
          
        } catch (error) {
          console.error('Failed to fetch course data', error);
        }
      }
    };

    fetchData();
  }, [id, userEmail]);

  const handleProceedToPayment = async () => {
    if (course && userEmail) {
      const paymentData: PaymentData = {
        emailRequest: userEmail,
        courseId: course.courseId,
        amount: course.price,
        instructorID: course.userId,
      };

      try {
        await axios.post(import.meta.env.VITE_SERVERHOST+'/api/v1/auth/paymentcourse', paymentData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // Redirect to payment confirmation or success page if needed
        navigate(`/detailpage/buy/success`);
      } catch (error) {
        console.error('Failed to proceed with payment', error);
        // Handle error accordingly
      }
    }
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-6">
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card sx={{ maxWidth: 800, width: '100%', boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
                <span className="font-serif text-lg">BILLING INFORMATION</span><br />
              </h1>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <CardMedia
                    component="img"
                    sx={{ width: '100%', height: '100%' }}
                    image={course.imgLink}
                    alt={course.courseName}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Course Name:</strong> {course.courseName}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Instructor Name:</strong> {fullName}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Category Name:</strong> {fullNameCategory}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      <strong>Price:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" mt={2}>
                      <strong>Buy by:</strong> {fullNameStudent}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleProceedToPayment}
            className="inline-flex items-center gap-2 bg-blue-500 py-3 px-6 text-center text-sm font-medium text-white hover:bg-blue-600 rounded-lg shadow-md transition duration-300"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPaymentCourse;
