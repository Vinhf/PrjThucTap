import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import UserLayout from '../../layout/UserLayout';
import { useEmail } from '../../utils/auth';
import { Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAllWishlist, removeCourseFromWishlist} from '../../services/CourseService/CourseService';


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
interface WishlistData {
  email: string | null;
  courseId: number;
}

const Wishlist: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const userEmail = useEmail();
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    if(userEmail) {
      fetchWishlist(userEmail);
    }
    }, [userEmail]);
   
    const fetchWishlist = async (email : string) => {
      try {
        const response = await getAllWishlist(email);
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch wishlist', error);
        setLoading(false);
      }
    };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, course: Course) => {
    setSelectedCourse(course);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleAddCartShopping = async (course : Course) => {
    if (course) {
      const wishlistData: WishlistData = {
        email : userEmail,
        courseId: course.courseId,
      };
      try {
        const response = await axios.post(import.meta.env.VITE_SERVERHOST+'/api/v1/auth/orders/add', wishlistData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200) {
          toast.success('Add Success!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        handleClose();
      } catch (error) {
        if (error.response && error.response.data === 'This course has been purchased') {
          toast.error('This course has been purchased', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
      } if(error.response && error.response.data === 'An error occurred while processing your order') {
        toast.error('The course already exists in the Cart-Shopping', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
     
      } if(error.response && error.response.data === 'You are not logged in') {
        toast.error('You are not logged in, redirect signin after 2s', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
          setTimeout(() => {
            navigate('/auth/signin'); 
        }, 2000);
        
        }
      }
    }
  };

  const handleRemoveClick = async () => {
    if (selectedCourse && userEmail) {
      try {
        const response = await removeCourseFromWishlist(userEmail, selectedCourse.courseId);
        if (response.status === 200) {
          toast.success('Remove Success!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        handleClose();
        
        // Remove the course from the list
        setCourses(courses.filter(course => course.courseId !== selectedCourse.courseId));
        handleClose();
      } catch (error) {
        console.error('Failed to remove from wishlist', error);
      }
    }
  };

  const formattedPrice = (price: string) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(price));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="container mx-auto py-12">
        <h2 className="text-2xl font-semibold mb-6">My Wishlist</h2>
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
          {courses.map((course) => (
            <Card key={course.courseId} sx={{ maxWidth: 345 }} className='wishlist-card'>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    R
                  </Avatar>
                }
                action={
                  <>
                    <IconButton aria-label="more options" onClick={(event) => handleClick(event, course)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedCourse === course}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleRemoveClick}>Remove wishlist</MenuItem>
                    </Menu>
                  </>
                }
                title={course.courseName}
                subheader={course.updateDate ? course.updateDate.split("T")[0] : ''}
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
              <IconButton aria-label="cart" onClick={() => handleAddCartShopping(course)}>
              <AddShoppingCartIcon />
        </IconButton>
                <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 'auto', paddingRight: '16px' }}>
                  {formattedPrice(course.price)}
                </Typography>
              </CardActions>
              <ToastContainer />
            </Card>
          ))}
        </Box>
      </div>

  );
};

export default Wishlist;
