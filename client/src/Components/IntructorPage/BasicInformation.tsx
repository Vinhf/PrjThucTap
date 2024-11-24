import React, { useState, useEffect } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
import { useAuth } from '../../utils/auth';
import SelectGroupOne from '../Forms/SelectGroup/SelectGroupOne';

interface BasicInformationProps {
  onComplete: () => void;
}

interface Category {
  id: string;
  name: string;
}

const BasicInformation: React.FC<BasicInformationProps> = ({ onComplete }) => {
  const authInfo = useAuth();
  const [courseData, setCourseData] = useState(() => {
    const savedData = sessionStorage.getItem('courseData');
    return savedData
      ? JSON.parse(savedData)
      : {
          email: '',
          categoryId: '',
          courseTitle: '',
          shortDescription: '',
          sections: [],
          video: '',
          poster: '',
          price: '',
          coupon: '',
        };
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = () => {
      setLoading(true);
      axios
        .get<Category[]>( import.meta.env.VITE_SERVERHOST+'/api/v1/auth/categories/all')
        .then((res) => {
          setCategories(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Error fetching categories: ' + err.message);
          setLoading(false);
        });
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (authInfo?.sub) {
      setCourseData((prevData) => ({
        ...prevData,
        email: authInfo.sub,
      }));
    }
  }, [authInfo?.sub]);

  useEffect(() => {
    sessionStorage.setItem('courseData', JSON.stringify(courseData));

    if (courseData.courseTitle.trim() && courseData.shortDescription.trim()) {
      onComplete();
    }
  }, [courseData, onComplete]);

  const handleCourseTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseData((prevData) => ({
      ...prevData,
      courseTitle: e.target.value,
    }));
  };

  const handleShortDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCourseData((prevData) => ({
      ...prevData,
      shortDescription: e.target.value,
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setCourseData((prevData) => ({
      ...prevData,
      categoryId
    }));
  };
  const handleCategoryChangeName = (categoryId: string) => {
    setCourseData((prevData) => ({
      ...prevData,
      categoryId
    }));
  };
  return (
    <div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
          <InfoIcon />
          <h3 className="font-medium text-black dark:text-white ml-2">
            Basic Information
          </h3>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          <div>
            <label className="mb-3 block text-black dark:text-white">
              Course Title
            </label>
            <input
              type="text"
              placeholder="Course title here"
              value={courseData.courseTitle}
              onChange={handleCourseTitleChange}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-3 block text-black dark:text-white">
              Short Description*
            </label>
            <textarea
              rows={6}
              placeholder="Item description"
              value={courseData.shortDescription}
              onChange={handleShortDescriptionChange}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            ></textarea>
          </div>
          <div>
            <div className="flex flex-col">
              <SelectGroupOne
                categories={categories}
                onCategoryChange={handleCategoryChange}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
