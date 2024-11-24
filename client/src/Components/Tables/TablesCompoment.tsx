import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import {
  getCourseByEmail,
  listCourse,
  deletCourse,
  banCourse,
  updateCourseStatus,
} from '../../services/CourseService/CourseService';
import { toast } from 'react-toastify';
import { Button, Chip, IconButton, Switch, Tooltip } from '@mui/material';
import { CheckCircle, Cancel, Edit, Delete, Add } from '@mui/icons-material';
import Header from '../Header';

const muiCache = createCache({
  key: 'mui-datatables',
  prepend: true,
});

interface Course {
  courseId: string;
  userId: string;
  categoryId: string;
  courseName: string;
  description: string;
  videoLink: string;
  imgLink: string;
  updateDate: string;
  status: string;
  price: string;
}



const TableReact: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [courses, setCourses] = useState<Course[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;
  const token = useAuth();

  useEffect(() => {
    const storedMode = localStorage.getItem('color-theme');
    const mode = storedMode === '"dark"' ? 'dark' : 'light';
    setThemeMode(mode);

    if (token?.sub) {
      fetchCourse(token?.sub);
    }

    if (data === 'Khóa học đã được lưu thành công') {
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
  }, [token?.sub, data]);

  const fetchCourse = async (Email: string) => {
    try {
      let formattedCourses = [];
      if (token?.role.includes('ROLE_INSTRUCTOR')) {
        const response = await getCourseByEmail(Email);
        formattedCourses = response.data;
      } else if (token?.role.includes('ROLE_ADMIN')) {
        const response = await listCourse();
        formattedCourses = response.data;
      }

      setCourses(formattedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleDelete = async (courseId: string) => {
    try {
      if (token?.role.includes('ROLE_INSTRUCTOR')) {
        await deletCourse(courseId);
        toast.success('Course banned successfully');
      }
      fetchCourse(token?.sub);
    } catch (error) {
      toast.error('Error deleting course');
      console.error('Error deleting course:', error);
    }
  };

  const handleAddCourse = () => {
    navigate('/CreateCoureFor', { state: { mode: 'add' } });
  };
  
  const handleEditCourse = (courseId: string) => {
    navigate('/CreateCoureFor', { state: { mode: 'update', course: courseId  } });
  };

  const toggleCourseStatus = async (
    courseId: string,
    currentStatus: string,
  ) => {
    if (token?.role.includes('ROLE_ADMIN')) {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      try {
        await banCourse(courseId, newStatus);
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.courseId === courseId
              ? { ...course, status: newStatus }
              : course,
          ),
        );
        toast.success(`Course status updated to ${newStatus}`);
      } catch (error) {
        toast.error('Error updating course status');
        console.error('Error updating course status:', error);
      }
    } else {
      toast.error('You do not have permission to change the course status');
    }
  };

  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const columns = [
    {
      name: 'courseId',
      label: 'Course Id',
    },
    {
      name: 'courseName',
      label: 'Course Name',
      options: { filterOptions: { fullWidth: true } },
    },
    {
      name: 'updateDate',
      label: 'Date',
      options: {
        customBodyRender: (value: string) => {
          // Assuming value is a date string or Date object
          const date = new Date(value);
          return date.toISOString().split('T')[0];
        },
      },
    },
    {
      name: 'price',
      label: 'Price',
      options: {
        customBodyRender: (value: string) => {
          const formattedPrice = parseFloat(value).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
          });
          return formattedPrice;
        },
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        customBodyRender: (value: string, tableMeta: any) => {
          const courseId = tableMeta.rowData[0];
          const isActive = value === 'active';

          return (
            <div style={{}}>
              <Tooltip title={isActive ? 'Deactivate' : 'Activate'}>
                <IconButton onClick={() => toggleCourseStatus(courseId, value)}>
                  {isActive ? (
                    <Cancel style={{ fontSize: '24px', color: 'red' }} />
                  ) : (
                    <CheckCircle style={{ fontSize: '24px', color: 'blue' }} />
                  )}
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <>
              <IconButton
                onClick={() => {
                  const courseId = tableMeta.rowData[0];
                  handleEditCourse(courseId);
                }}
              >
                <Edit />
              </IconButton>
              {token?.role.includes('ROLE_INSTRUCTOR') && (
                <IconButton
                  onClick={() => {
                    const courseId = tableMeta.rowData[0];
                    handleDelete(courseId);
                  }}
                >
                  <Delete />
                </IconButton>
              )}
            </>
          );
        },
      },
    },
  ];

  const options: MUIDataTableOptions = {
    search: true,
    download: true,
    print: true,
    viewColumns: true,
    filter: true,
    filterType: 'dropdown',
    responsive: 'vertical',
    tableBodyHeight: 'h-full',
    tableBodyMaxHeight: '',
    onTableChange: (action, state) => {
      console.log(action);
      console.dir(state);
    },
  };

  return (
    <div>
      <CacheProvider value={muiCache} >
        <ThemeProvider theme={theme} >
          <div style={{ padding: '20px' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleAddCourse}
              style={{ marginBottom: '20px' }}
            >
              Add Course
            </Button>
            <MUIDataTable
              title={'Courses List'}
              data={courses}
              columns={columns}
              options={options}
            />
          </div>
        </ThemeProvider>
      </CacheProvider>
    </div>
  );
};

export default TableReact;
