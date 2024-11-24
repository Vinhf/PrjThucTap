import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CardHome from '../Components/HomePage/CardHome';
import Footer from '../Components/Footer';
import { Pagination } from '@mui/material';

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

const Search: React.FC = () => {
  const { keyword } = useParams<{ keyword: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);

  useEffect(() => {
    console.log('Search component rendered');
    console.log('Keyword:', keyword);

    const fetchCourses = async () => {
      if (!keyword) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(import.meta.env.VITE_SERVERHOST+'/api/v1/auth/courses/search', {
          params: {
            keyword: keyword,
            page: page - 1, // Adjust for 0-based page index used by backend
            size: 8, // Number of items per page
          },
        });

        setCourses(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalElements(response.data.totalElements || 0);
      } catch (error: any) {
        setError('Error fetching search results.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [keyword, page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div>
      <div className="home-container bg-gray-100 min-h-screen flex flex-col justify-between">
        <main className="flex-grow">
          <div className="container mx-auto py-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <section className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-800">
                  {keyword ? `Found "${totalElements}" results for "${keyword}"` : 'No results found for your search.'}
                </h1>
              </section>
              {loading ? (
                <p className="text-center text-gray-600">Loading...</p>
              ) : error ? (
                <p className="text-center text-red-600">{error}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <CardHome key={course.courseId} course={course} />
                    ))
                  ) : (
                    <p className="text-center text-gray-600">No courses found.</p>
                  )}
                </div>
              )}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                  />
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Search;
