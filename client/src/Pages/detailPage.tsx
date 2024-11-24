import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import UserOne from '../images/user/user-01.png';
import { Link } from 'react-router-dom';
import { getCourseById } from '../services/CourseService/CourseService';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CommentIcon from '@mui/icons-material/Comment';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { useAuth, useEmail } from '../utils/auth';
import Pagination from '../Components/PaginationProps';
import { ConstructionOutlined } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import { getTitleByCourseId } from '../services/CourseService/TitleService';

interface Course {
  courseId: number;
  userId: number;
  categoryId: number;
  courseName: string;
  description: string;
  videoLink: string;
  imgLink: string;
  updateDate: string;
  status: string;
  price: string;
}

interface Comment {
  message: string;
  rating: number;
  full_name: string;
  avt: string;
  user_id: string;
  email: string;
}

interface Body {
  emailRequest: string | null;
  courseId: number;
}
interface Title {
  titleId: String;
  courseId: String;
  titleName: String;
  passed: Boolean;
}

interface cart {
  email : string | null;
  courseId: number;
}

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [title, setTitle] = useState<Title | null>(null);
  const [value, setValue] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [commentsPerPage] = useState<number>(5);
  const navigate = useNavigate();
  const userEmail = useEmail();
  const decode = useAuth();
  const email = decode?.sub;
  const role = decode?.role;
  const hasCommented = comments.some((comment) =>
    comment.email?.includes(userEmail),
  );
  const [sortOrder, setSortOrder] = useState('desc');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Thực hiện gọi API hoặc xử lý khi trang thay đổi
  };
  useEffect(() => {
    if (id) {
      fetchCourse(id);
      fetchTitle
      fetchComments(id);
    }
  }, [id]);

  useEffect(() => {
    if (course) {
      checkCourse();
    }
  }, [course]);

  const fetchCourse = async (courseId: string) => {
    try {
      const response = await getCourseById(courseId);
      setCourse(response.data);
    } catch (error) {
      console.error('Failed to fetch course:', error);
    }
  };

  const fetchTitle = async (courseId: string) => {
    try {
      const response = await getTitleByCourseId(courseId);
      setTitle(response.data);
    } catch (error) {
      console.error('Failed to fetch course:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() && newRating > 0) {
      try {
        await axios.post(
          import.meta.env.VITE_SERVERHOST+'/api/v1/feedbacks/create',
          {
            email: email,
            courseId: id,
            message: newComment,
            rating: newRating,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );
        fetchComments(course?.courseId.toString() || '');
        setNewComment('');
        setNewRating(0);
      } catch (error) {
        console.error('Failed to submit comment:', error);
      }
    }
  };

  const checkCourse = async () => {
    if (course) {
      const body: Body = {
        emailRequest: userEmail,
        courseId: course.courseId,
      };
      console.log(body.emailRequest)
      console.log(body.courseId)
      try {
          const response = await axios.post(
            import.meta.env.VITE_SERVERHOST+'/api/v1/auth/payment-courses/check-course', body, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            },
          );
          console.log(response.status)
          if (response.status === 200) {
            navigate(`/detailCourseEnroll/${course.courseId}`);
          }
        
      } catch (error) {
        console.error('Error checking course status:', error);
      }
    }
  };

  const fetchComments = async (courseId: string) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVERHOST+`/api/v1/auth/feedbacks/getFeedback/${courseId}?page=${currentPage}&size=${commentsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.rating - b.rating;
    }
    return b.rating - a.rating;
  });

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = sortedComments.slice(
    indexOfFirstComment,
    indexOfLastComment,
  );
  const totalPages = Math.ceil(sortedComments.length / commentsPerPage);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleAddCartShopping = async () => {
    if (course) {
      const Cart: cart = {
        email: userEmail,
        courseId: course.courseId,
      };
      try {
        const response = await axios.post(
          import.meta.env.VITE_SERVERHOST+'/api/v1/auth/orders/add',
          Cart,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );
        if (response.status === 200) {
          toast.success('Add Success!', {
            position: 'top-right',
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
        if (
          error.response &&
          error.response.data === 'This course has been purchased'
        ) {
          toast.error('This course has been purchased', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        if (
          error.response &&
          error.response.data ===
            'An error occurred while processing your order'
        ) {
          toast.error('The course already exists in the Cart-Shopping', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        if (error.response && error.response.data === 'You are not logged in') {
          toast.error('You are not logged in, redirect signin after 2s', {
            position: 'top-right',
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
  const handleBuySelected = () => {
    if (!course) return;
  
    // Create the selected course details
    const selectedCourseDetails = {
      emailRequest: userEmail,
      courseId: course.courseId,
      amount: course.price,
      instructorID: course.userId,
      courseName: course.courseName,
      description: course.description,
      imgLink: course.imgLink,
    };
  
    // Navigate to the checkout page with the selected course details in an array
    navigate('/cartshopping/bill', { state: { courses: [selectedCourseDetails] } });
  };
  if (!course) {
    return <div>Loading...</div>;
  }

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      fetchComments(course.courseId.toString());
    }
  };
  return (
    <div>
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
        <main className="p-4 md:p-6 2xl:p-10">
          {/* Course Info */}

          <div className="flex flex-col md:flex-row mb-6">
            <div className="md:w-1/3 mb-4 md:mb-0 flex flex-col">
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Card
                  className="border rounded-lg shadow-md dark:bg-boxdark"
                  sx={{
                    maxWidth: '100%',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardCover>
                    <video
                      className="rounded-lg"
                      autoPlay
                      loop
                      muted
                      poster={course.imgLink}
                    >
                      <source src={course.videoLink} type="video/mp4" />
                    </video>
                  </CardCover>
                  <CardContent className="flex-grow">
                    <Typography
                      level="body-lg"
                      fontWeight="lg"
                      textColor="#fff"
                      mt={2}
                    >
                      {/* Video description or any additional text can go here */}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </div>
            <div className="md:w-2/3 px-4 flex flex-col">
              <Typography
                variant="h4"
                component="h1"
                className="text-3xl font-bold text-gray-100 mb-4"
              >
                {course.courseName}
              </Typography>
              <Typography
                variant="body1"
                className="text-base text-gray-300 mb-4"
              >
                {course.description}
              </Typography>
              <div className="mb-4 flex items-center space-x-2">
                <Typography
                  variant="h6"
                  className="text-base font-semibold text-gray-100"
                >
                  Rating:
                </Typography>
                <Rating name="read-only" value={4} readOnly />
              </div>
              <Typography
                variant="body2"
                className="text-sm text-gray-400 mb-4"
              >
                Language: English
              </Typography>
              <Typography
                variant="body2"
                className="text-sm text-gray-400 mb-4"
              >
                Duration: 12 hours
              </Typography>
              <div className="flex space-x-4 mt-auto">
                <button
                  onClick={handleAddCartShopping}
                  className="inline-flex items-center gap-2 bg-blue-600 py-2 px-4 text-center text-sm font-medium text-white hover:bg-blue-700 rounded-lg shadow-md"
                >
                  <AddShoppingCartIcon />
                  Add to cart
                </button>

                <button
                  onClick={handleBuySelected}
                  className="inline-flex items-center justify-center border border-blue-600 py-2 px-4 text-center font-medium text-blue-600 hover:bg-blue-50 rounded-lg shadow-md"
                >
                  Buy Now
                  </button>
              </div>
            </div>
          </div>

          {/* Instructor Info */}
          <div className="flex items-center border-t border-gray-700 pt-4 mt-4">
            <Link className="flex items-center gap-4" to="#">
              <img
                src={UserOne}
                alt="Instructor"
                className="h-14 w-14 rounded-full border-2 border-blue-500"
              />
              <div className="text-right">
                <Typography
                  variant="body1"
                  className="text-lg font-semibold text-gray-100"
                >
                  Tung vl
                </Typography>
              </div>
            </Link>
          </div>

          {/* Review Section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4 justify-around">
                <button
                  onClick={() => setValue(0)}
                  className={`py-2 px-4 rounded-lg ${value === 0 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  <StarIcon />
                  Review
                </button>
                <button
                  onClick={() => setValue(1)}
                  className={`py-2 px-4 rounded-lg ${value === 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  <LibraryBooksIcon />
                  Course Content
                </button>
                <button
                  onClick={() => setValue(2)}
                  className={`py-2 px-4 rounded-lg ${value === 2 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  <CommentIcon />
                  Comments
                </button>
              </div>
            </div>

            {value === 0 && (
              <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                <Typography variant="body1" className="text-gray-100 mb-2">
                  Reviews
                </Typography>
                <Typography variant="body2" className="text-gray-300 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Vivamus lacinia odio vitae vestibulum.
                </Typography>
              </div>
            )}

            {value === 1 && (
              <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                <Typography variant="body1" className="text-gray-100 mb-2">
                  Course Content
                </Typography>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id="panel1a-header"
                  >
                    <Typography>Chapter 1: Introduction</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      This chapter covers the basics of the course.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                {/* Add more chapters as needed */}
              </div>
            )}

            {value === 2 && (
              <div className="border border-gray-700 rounded-lg p-6 bg-gray-900">
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h5" className="text-gray-100">
                    <div className="text-2xl">Comments</div>
                  </Typography>
                  <div className="flex items-center">
                    <Typography variant="body1" className="text-gray-300 mr-4">
                      Sort by Rating:
                    </Typography>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="p-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="desc">Highest to Lowest</option>
                      <option value="asc">Lowest to Highest</option>
                    </select>
                  </div>
                </div>

                {/* Display sorted comments */}
                {currentComments.map((comment, index) => (
                  <div
                    key={index}
                    className="flex items-start mb-6 p-4 bg-gray-800 rounded-lg shadow-lg"
                  >
                    <img
                      src={comment.avt}
                      alt="User"
                      className="h-12 w-12 rounded-full border-2 border-blue-500 mr-4"
                    />
                    <div className="flex flex-col">
                      <Typography
                        variant="body1"
                        className="text-gray-100 font-semibold"
                      >
                        {comment.full_name}
                      </Typography>
                      <Rating
                        value={comment.rating}
                        readOnly
                        className="mt-1"
                      />
                      <Typography
                        variant="body2"
                        className="text-gray-300 mt-2"
                      >
                        {comment.message}
                      </Typography>
                    </div>
                  </div>
                ))}

                {/* Add Comment Section */}
                {role?.includes('ROLE_STUDENT') && !hasCommented && (
                  <div className="mt-6">
                    <Typography variant="h6" className="text-gray-100 mb-2">
                      Leave a Comment
                    </Typography>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={4}
                      className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write your comment here..."
                    />
                    <Rating
                      value={newRating}
                      onChange={(e, newValue) => setNewRating(newValue || 0)}
                      className="mt-2"
                    />
                    <button
                      onClick={handleCommentSubmit}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={hasCommented}
                    >
                      Submit
                    </button>
                  </div>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className=" font-bold py-2 px-4 bg-gray-800 text-gray-100 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <div className="text-gray-300 text-sm font-bold">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentComments.length < commentsPerPage}
                    className=" font-bold py-2 px-4 bg-gray-800 text-gray-100 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DetailPage;
