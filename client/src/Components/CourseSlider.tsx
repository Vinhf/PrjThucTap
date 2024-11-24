import React from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CardHome from './HomePage/CardHome';

interface Courses {
  imgLink: string;
  courseName: string;
  userFullName: string;
  price: number;
  courseId: string;
  views: string;
  daysAgo: string;
  duration: string;
  rating: number;
  isBestseller: boolean;
}

interface CourseSliderProps {
  courses: Courses[];
}

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} next-arrow absolute top-1/3 transform -translate-y-1/2 right-0 z-10 p-4 cursor-pointer`}
      style={{ ...style }}
      onClick={onClick}
    >
      {/* Nội dung SVG next arrow */}
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} prev-arrow absolute top-1/3 transform -translate-y-1/2 left-0 z-10 p-4 `}
      style={{ ...style }}
      onClick={onClick}
    >
      {/* Nội dung SVG previous arrow */}
    </div>
  );
};

const CourseSlider: React.FC<CourseSliderProps> = ({ courses }) => {
  // Determine slider settings based on the number of courses
  const settings =
    courses.length >= 5
      ? {
          dots: false,
          infinite: courses.length >= 5,
          speed: 500,
          slidesToShow: courses.length >= 5 ? 4 : courses.length,
          slidesToScroll: courses.length >= 5 ? 3 : 1,
          arrows: courses.length >= 5,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                arrows: false,
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true,
                dots: false,
              },
            },
            {
              breakpoint: 600,
              settings: {
                arrows: false,
                slidesToShow: 2,
                slidesToScroll: 1,
                initialSlide: 2,
              },
            },
            {
              breakpoint: 480,
              settings: {
                arrows: false,
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ],
        }
      : {
          dots: false,
          infinite: false,
          speed: 500,
          slidesToShow: courses.length,
          slidesToScroll: 1,
          arrows: false,
          centerMode: false, // Enable centering
          centerPadding: '0', // Adjust padding
        };

  return (
    <div className="w-full mx-auto">
      <div className="relative">
        {courses.length >= 5 ? (
          <Slider {...settings} className="card-wrapper">
            {courses.map((course, index) => (
              <div key={index} style={{ padding: '0 1.5px' }}>
                <CardHome course={course} />
              </div>
            ))}
          </Slider>
        ) : (
          <div className="flex flex-wrap">
            {courses.map((course, index) => (
              <div key={index} className="m-2">
                <CardHome course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSlider;
