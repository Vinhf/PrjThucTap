import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import { red } from '@mui/material/colors';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import UserLayout from '../../layout/UserLayout';
import { useEmail } from '../../utils/auth';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAllCart, removeSelectedCourses } from '../../services/CourseService/CourseService';

interface Course {
  courseId: number;
  userId: number;
  categoryId: number;
  courseName: string;
  description: string;
  videoLink: string;
  imgLink: string;
  updateDate: string | null | undefined;
  status: string;
  price: string;
}

const CartShopping = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Set<number>>(new Set());
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const userEmail = useEmail();
  const navigate = useNavigate();

  useEffect(() => {
    if(userEmail) {
    fetchCartlist(userEmail);
  }
  }, [userEmail]);
    const fetchCartlist = async (email : string) => {
      try {
        const response = await getAllCart(email);
        console.log(response.data)
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch cart', error);
        setLoading(false);
      }
    };
  

  const handleSelectCourse = (courseId: number) => {
    setSelectedCourses(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(courseId)) {
        newSelected.delete(courseId);
      } else {
        newSelected.add(courseId);
      }
      return newSelected;
    });
  };
  const handleSelectAll = () => {
    if (allSelected) {
      // Nếu đã chọn tất cả, thì bỏ chọn tất cả
      setSelectedCourses(new Set());
    } else {
      // Nếu chưa chọn tất cả, chọn tất cả các khóa học
      setSelectedCourses(new Set(courses.map(course => course.courseId)));
    }
    // Chuyển đổi trạng thái của allSelected
    setAllSelected(prev => !prev);
  };

  const handleRemoveSelected = async () => {
    const selectedCoursesArray = Array.from(selectedCourses).map(courseId => ({ email: userEmail, courseId }));
    console.log(selectedCoursesArray);
    try {
      
      const response = await removeSelectedCourses(selectedCoursesArray);

      if (response.status === 200) {
        toast.success('Removed selected courses successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setCourses(courses.filter(course => !selectedCourses.has(course.courseId)));
        setSelectedCourses(new Set());
        setAllSelected(false);
      }
    } catch (error) {
      console.error('Failed to remove from Cart', error);
      if (error.response && error.response.status === 403) {
        toast.error('You do not have permission to perform this action.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };
  

  const handleBuySelected = () => {
    const selectedCourseDetails = Array.from(selectedCourses).map(courseId => {
      const course = courses.find(course => course.courseId === courseId);
      if (course) {
        return {
          emailRequest: userEmail,
          courseId: course.courseId,
          amount: course.price,
          instructorID: course.userId,
          courseName: course.courseName,
          description: course.description,
          imgLink: course.imgLink,
        };
      }
      return null;
    }).filter(item => item !== null);
    const selectedCourseDetail = Array.from(selectedCourses).map(courseId => {
        const course = courses.find(course => course.courseId === courseId);
        if (course) {
          return {
            email: userEmail,
            courseId: course.courseId,
          };
        }
        return null;
      }).filter(item => item !== null);
  
    navigate('/cartshopping/bill', { state: { courses: selectedCourseDetails, coursess: selectedCourseDetail} });
  };
  const formattedPrice = (price: string) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(price));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
  
      <div className="container mx-auto py-12">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">My Shopping Cart</h2>
          <div>
          <Button variant="contained" color="info" onClick={handleSelectAll} style={{ marginRight: '10px' }}>
  {allSelected ? 'Deselect All' : 'Select All'}
</Button>
            <Button variant="contained" color="error" onClick={handleRemoveSelected} disabled={selectedCourses.size === 0}>
              Remove Cart-Shopping
            </Button>
            <Button variant="contained" color="primary" onClick={handleBuySelected} disabled={selectedCourses.size === 0} style={{ marginLeft: '10px' }}>
              Buy Selected Cards
            </Button>
          </div>
        </div>
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
          {courses.map((course) => (
            <Card key={course.courseId} sx={{ maxWidth: 345 }} className='cart-shopping'>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    R
                  </Avatar>
                }
                title={course.courseName}
                subheader={course.updateDate ? course.updateDate.split("T")[0] : ''}
                action={
                  <Checkbox
                    checked={selectedCourses.has(course.courseId)}
                    onChange={() => handleSelectCourse(course.courseId)}
                  />
                }
              />
              <Link to={`/detailPage/${course.courseId}`}>
                <CardMedia
                  component="img"
                  image={course.imgLink}
                  alt={course.courseName}
                  className='h-55'
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {course.description}
                  </Typography>
                </CardContent>
              </Link>
              <CardActions disableSpacing>
                <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 'auto', paddingRight: '16px' }}>
                  {formattedPrice(course.price)}
                </Typography>
              </CardActions>
            </Card>
          ))}
        </Box>
        <ToastContainer />
      </div>
    
  );
};

export default CartShopping;
