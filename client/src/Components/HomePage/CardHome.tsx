import React, { useState, useEffect, MouseEvent } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useEmail } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';


interface Course {
  courseId: number;
  userId: number;
  categoryId: number;
  courseName: string;
  description: string;
  videoLink: string;
  imgLink: string;
  updateDate: string | null;
  status: string;
  price: string;
}

interface WishlistData {
  email: string | null;
  courseId: number;
}

interface body {
  emailRequest:string | null;
  courseId:number;
}


const CardHome: React.FC<{ course: Course }> = ({ course }) => {
  let date = '';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const userEmail = useEmail();
  const navigate = useNavigate();
 

  


  if (course.updateDate) {
    date = course.updateDate.split("T")[0];
  }

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
 
  const handleAddWishlist = async () => {
    if (course) {
      const wishlistData: WishlistData = {
        email : userEmail,
        courseId: course.courseId,
      };
      try {
        const response = await axios.post( import.meta.env.VITE_SERVERHOST+'/api/v1/auth/wishlist/add', wishlistData, {
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
        if (error.response && error.response.data === "Course has already been added to the Wishlist") {
          toast.error('The course already exists in the Wishlist', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          console.error('Failed to Add', error);
          toast.error('You are not logged in, redirect signin after 2s', {
            position: "top-right",
            autoClose: 1000,
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
  const handleAddCartShopping = async () => {
    if (course) {
      const wishlistData: WishlistData = {
        email : userEmail,
        courseId: course.courseId,
      };
      console.log(wishlistData.email)
      console.log(wishlistData.courseId)
      try {
        const response = await axios.post( import.meta.env.VITE_SERVERHOST+'/api/v1/auth/orders/add', wishlistData, {
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
            navigate('/auth/'); 
        }, 2000);
        
        }
      }
    }
  };


  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseFloat(course.price));
  return (
    <Card sx={{ width: 300, height: 400 }} className='mx-1'>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {course.courseName.charAt(0)} {/* Hiển thị ký tự đầu tiên của tên khóa học */}
          </Avatar>
        }
        action={
          <div>
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleAddWishlist}>Add Wishlist</MenuItem>
            </Menu>
          </div>
        }
        title={course.courseName}
        subheader={date}
      />
       <Link to={`/detailPage/${course.courseId}`}>
                <CardMedia
                  component="img"
                  image={course.imgLink}
                  alt={course.courseName}
                  className='h-56'
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {course.description}
                  </Typography>
                </CardContent>
              </Link>
      <CardActions disableSpacing>
      <IconButton aria-label="cart" onClick={handleAddCartShopping}>
            <AddShoppingCartIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 'auto', paddingRight: '16px' }}>
          {formattedPrice}
        </Typography>
      </CardActions>
      <ToastContainer />
    </Card>
  );
};

export default CardHome;
