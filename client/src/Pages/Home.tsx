import React, { useEffect, useState } from 'react';
import { listCourse } from '../services/CourseService/CourseService';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import CardHome from '../Components/HomePage/CardHome';
import { useAuth } from '../utils/auth';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS

import UserLayout from '../layout/UserLayout';
import CourseSlider from '../Components/CourseSlider';

interface Course {
  courseId: number;
  userId: number;
  categoryId: number;
  courseName: String;
  description: String;
  videoLink: String;
  imgLink: String;
  updateDate: String;
  status: String;
  price: String;
}

const Home: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [course, setCouse] = useState<Course[]>([]);
  useEffect(() => {
    getAll();
  }, []);

  function getAll() {
    listCourse()
      .then((response) => {
        setCouse(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <main className="bg-gray-100 min-h-screen">
        <header className="bg-white py-6 shadow-md shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold">Welcome to AEG3</h1>
            <p className="mt-2">
              nơi có tất cả mọi thứ để trở thành coder chuyên nghiệp
            </p>
          </div>
        </header>

        <section className="container mx-auto py-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Courses</h2>
          <div className="bg-white p-6 rounded-lg shadow-md shadow-default dark:border-strokedark dark:bg-boxdark">
            {course.length === 0 ? (
              <p className="text-center text-gray-500">No courses available</p>
            ) : (
              <CourseSlider courses={course} />
            )}
          </div>
        </section>

        <section className="container mx-auto py-12">
          <h2 className="text-2xl font-semibold mb-6">New Courses</h2>
          <div className="bg-white p-6 rounded-lg shadow-md shadow-default dark:border-strokedark dark:bg-boxdark">
            {course.length === 0 ? (
              <p className="text-center text-gray-500">No courses available</p>
            ) : (
              <CourseSlider courses={course} />
            )}
          </div>
        </section>

        <section className="bg-gray-200 py-12">
          <div className="container mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md text-center shadow-default dark:border-strokedark dark:bg-boxdark">
                <h3 className="text-xl font-semibold">Expert Instructors</h3>
                <p className="mt-4 text-gray-600">
                  Learn from industry experts who are passionate about teaching.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center shadow-default dark:border-strokedark dark:bg-boxdark">
                <h3 className="text-xl font-semibold">Flexible Learning</h3>
                <p className="mt-4 text-gray-600">
                  Study at your own pace, with lifetime access to courses.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center shadow-default dark:border-strokedark dark:bg-boxdark">
                <h3 className="text-xl font-semibold">Community Support</h3>
                <p className="mt-4 text-gray-600">
                  Join a community of learners and get help when you need it.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
      <ToastContainer /> {/* Đặt ToastContainer ở đây */}
    </div>
  );
};

export default Home;
