import React, { useEffect, useState } from 'react';
import { deleteUser, listUser } from '../services/UserGetAll';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  IconButton,
  Tooltip,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const muiCache = createCache({
  key: 'mui-datatables',
  prepend: true,
});

const ListUserComponent = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedMode = localStorage.getItem('color-theme');
    const mode = storedMode === '"dark"' ? 'dark' : 'light';
    setThemeMode(mode);
    getAllUsers();
  }, []);

  const getAllUsers = () => {
    listUser()
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  function addNewUser() {
    navigate('/addUser');
  }
  function updateUser(userId: string) {
    navigate(`/edit-user/${userId}`);
  }
  function removeUser(userId: string) { 
    console.log(userId);
    deleteUser(userId)
      .then((response) => {
        getAllUsers();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  const columns = [
    { name: 'userId', label: 'User ID' },
    { name: 'full_name', label: 'Full Name' },
    { name: 'email', label: 'Email' },
    {
      name: 'status',
      label: 'Status',
      options: {
        customBodyRender: (value: boolean) => (
          <span
            className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
              value ? 'bg-success text-success' : 'bg-danger text-danger'
            }`}
          >
            {value ? 'active' : 'inactive'}
          </span>
        ),
      },
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRender: (value: any, tableMeta: any) => {
          const userId = tableMeta.rowData[0];
          return (
            <div className="flex items-center space-x-3.5">
              <Tooltip title="Edit">
                <IconButton onClick={() => updateUser(userId)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => removeUser(userId)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </div>
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
    <div >
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={addNewUser}
        style={{ marginBottom: '20px' }}
      >
        Add User
      </Button>
      <CacheProvider value={muiCache}>
        <ThemeProvider theme={theme}>
          <div className="max-w-full overflow-x-auto">
            <MUIDataTable
              title={'Users List'}
              data={users}
              columns={columns}
              options={options}
            />
          </div>
        </ThemeProvider>
      </CacheProvider>
    </div>
  );
};

export default ListUserComponent;
