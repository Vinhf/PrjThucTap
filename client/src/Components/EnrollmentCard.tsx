// src/components/EnrollmentCard.js
import React from 'react';

const EnrollmentCard = ({ course }) => {
  const progress = course.progress || 3; // Default to 3 if progress is not provided

  return (
    <div className="relative border border-gray-300 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
      <img
        src={course.imgLink}
        alt={course.courseName}
        className="w-full h-32 object-cover"
      />
      <div className="p-4">
        <p className="text-sm text-gray-500">{course.category}</p>
        <h3 className="font-semibold text-lg">{course.courseName}</h3>
        <div className="mt-4">
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-blue-600 font-semibold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 border border-gray-300 shadow-sm">
              <div
                className="bg-green-500 h-full rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
              <div
                className="absolute top-0 left-0 h-full bg-gray-200 rounded-full"
                style={{ width: `${100 - progress}%` }}
              ></div>
            </div>
          </div>
          <button
            className={`px-4 py-2 mt-2 rounded-lg ${
              progress > 0 ? 'bg-green-500' : 'bg-blue-500'
            } text-white`}
          >
            {progress > 0 ? 'CONTINUE' : 'START COURSE'}
          </button>
        </div>
      </div>
      <div className="absolute inset-0 flex items-end justify-center p-4 bg-transparent">
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-4 shadow-lg transition-transform transform translate-y-full hover:translate-y-0">
          <p className="text-black">{course.description}</p>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentCard;
