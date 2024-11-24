// src/pages/EnrollmentView.js
import React, { useState, useEffect } from 'react';
import EnrollmentCard from '../Components/EnrollmentCard';
import axios from 'axios'; // Import axios for making API calls


// src/types/Course.ts

 interface Course {
    courseId: number;
    courseName: string;
    description: string;
    videoLink: string;
    imgLink: string;
    updateDate: string;
    status: string;
    price: number;
    progress: number; // Assuming you have a progress field in your data
    startDate: string; // If you have a start date in your course data
  }
  
const EnrollmentView = ({ userId }) => {
    const [courses, setCourses] = useState<Course[]>([]);

  const [filter, setFilter] = useState('All');

  useEffect(() => {
    console.log(userId);
    axios.get(import.meta.env.VITE_SERVERHOST+`/api/v1/auth/orders/users/${userId}/courses`)
    .then(response => {
      console.log(response.data); // Check if two courses are returned
      setCourses(response.data);
    })
    .catch(error => {
      console.error('Error fetching courses:', error);
    });
  
  }, [userId]);

  const filteredCourses = courses.filter(course => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return course.progress === 100;
    if (filter === 'In progress') return course.progress > 0 && course.progress < 100;
    if (filter === 'Failed') return course.progress === 0;
    return false;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <button
            onClick={() => setFilter('All')}
            className={`px-4 py-2 ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('Completed')}
            className={`px-4 py-2 ml-2 ${filter === 'Completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('In progress')}
            className={`px-4 py-2 ml-2 ${filter === 'In progress' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            In progress
          </button>
          <button
            onClick={() => setFilter('Failed')}
            className={`px-4 py-2 ml-2 ${filter === 'Failed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Failed
          </button>
        </div>
        <div className="font-bold text-xl">
          Showing {filteredCourses.length} {filter} courses
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
   {filteredCourses.map((course) => (
  <EnrollmentCard key={course.courseId} course={course} />
))}

      </div>
    </div>
  );
};

export default EnrollmentView;
