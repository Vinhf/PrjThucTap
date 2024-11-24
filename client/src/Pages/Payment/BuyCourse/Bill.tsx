import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

const Bill: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
  toast.success('Successfully purchased the selected courses!', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
});

  const handleReturnToHome = () => {
    navigate('/');
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-6">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            p: 3,
            borderRadius: 'md',
            boxShadow: 'md',
            backgroundColor: 'background.level1',
          }}
        >
          <div className="flex flex-col items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-24 h-24 text-green-500 mb-4"
            >
              <path
                fill="#2ecc71"
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
              />
            </svg>
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: 'text.primary' }}
            >
              Bạn Đã Thanh Toán Thành Công
            </Typography>
          </div>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: 'text.secondary' }}
          >
            Chúc bạn có một khóa học tuyệt vời nhé!
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            Xin Cảm Ơn
          </Typography>
          <Button
            className="px-4 py-2 text-lg font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"              
            onClick={handleReturnToHome}
          >
            Return to Home
          </Button>
        </Box>
        <ToastContainer />
      </div>
     </div>
      
  );
};

export default Bill;
