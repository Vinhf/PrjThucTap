import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, IconButton, Tooltip, ThemeProvider, createTheme } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import MUIDataTable, { MUIDataTableOptions } from 'mui-datatables';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';

interface Category {
  categoryId: number;
  categoryName: string;
}

const muiCache = createCache({
  key: 'mui-datatables',
  prepend: true,
});

const CategoryComponent: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const fetchToken = async () => {
      const tokenk = localStorage.getItem('token');
      if (tokenk !== null) {
        setToken(tokenk);
        fetchCategories();
      }
    };
    fetchToken();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    axios
      .get<Category[]>(import.meta.env.VITE_SERVERHOST+'/api/v1/auth/categories/all')
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching categories: ' + err.message);
        setLoading(false);
      });
  };

  const deleteCategory = (categoryId: number) => {
    setLoading(true);
    axios
      .delete(import.meta.env.VITE_SERVERHOST+`/api/v1/auth/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setCategories(categories.filter((category) => category.categoryId !== categoryId));
        setLoading(false);
      })
      .catch((err) => {
        setError('Error deleting category: ' + err.message);
        setLoading(false);
      });
  };

  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(
        import.meta.env.VITE_SERVERHOST+'/api/v1/auth/categories',
        { categoryName: newCategoryName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        setCategories([...categories, res.data]);
        setNewCategoryName('');
        setShowAddForm(false);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error adding category: ' + err.message);
        setLoading(false);
      });
  };

  const updateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCategory) {
      setLoading(true);
      axios
        .put(
          import.meta.env.VITE_SERVERHOST+`/api/v1/auth/categories/${currentCategory.categoryId}`,
          { categoryName: newCategoryName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          const updatedCategories = categories.map((category) =>
            category.categoryId === currentCategory.categoryId ? res.data : category,
          );
          setCategories(updatedCategories);
          setNewCategoryName('');
          setCurrentCategory(null);
          setShowUpdateForm(false);
          fetchCategories();
        })
        .catch((err) => {
          setError('Error updating category: ' + err.message);
          setLoading(false);
        });
    }
  };

  const startUpdate = (category: Category) => {
    setCurrentCategory(category);
    setNewCategoryName(category.categoryName);
    setShowUpdateForm(true);
    setShowAddForm(false);
  };

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  const columns = [
    { name: 'categoryId', label: 'Category ID' },
    { name: 'categoryName', label: 'Category Name' },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRender: (value: any, tableMeta: any) => {
          const categoryId = tableMeta.rowData[0];
          return (
            <div className="flex items-center space-x-3.5">
              <Tooltip title="Edit">
                <IconButton onClick={() => startUpdate({ categoryId, categoryName: tableMeta.rowData[1] })}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => deleteCategory(categoryId)}>
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
    onTableChange: (action: any, state: any) => {
      console.log(action);
      console.dir(state);
    },
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <CacheProvider value={muiCache}>
        <ThemeProvider theme={theme}>
          <div className="max-w-full overflow-x-auto">
            {showAddForm ? (
              <form onSubmit={addCategory} className="mb-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tên danh mục:
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    variant="contained"
                    color="secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : showUpdateForm ? (
              <form onSubmit={updateCategory} className="mb-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tên danh mục:
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Update
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowUpdateForm(false);
                      setCurrentCategory(null);
                    }}
                    variant="contained"
                    color="secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <Button
                  onClick={() => setShowAddForm(true)}
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  style={{ marginBottom: '20px' }}
                >
                  Add New Category
                </Button>
                <MUIDataTable
                  title={'Categories List'}
                  data={categories}
                  columns={columns}
                  options={options}
                />
              </>
            )}
          </div>
        </ThemeProvider>
      </CacheProvider>
    </div>
  );
};

export default CategoryComponent;
