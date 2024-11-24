import React, { useState, useEffect } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import UploadWidget from './UploadWidget';
import axios from 'axios';

interface MediaProps {
    onComplete: () => void; // Notify the parent component (CreateCourseForm) that the step is complete
  }

const Media: React.FC<MediaProps> = ({ onComplete }) => {
  const [courseData, setCourseData] = useState(() => {
    const savedData = sessionStorage.getItem('courseData');
    return savedData ? JSON.parse(savedData) : { courseTitle: '', shortDescription: '', sections: [], video: '', videoId: '', poster: '', posterId: '' };
  });

  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    sessionStorage.setItem('courseData', JSON.stringify(courseData));

    // Check if there are any sections
    if (courseData.posterId !== '' && courseData.videoId !== '') {
      onComplete(); // Notify the parent component that this step is complete
    }
  }, [courseData, onComplete]);

  const handleOnUpload = async (error: any, result: any, widget: any, type: 'video' | 'poster') => {
    if (error) {
      setError(error.message);
      widget.close({ quiet: true });
      return;
    }

    const newUrl = result?.info?.secure_url;
    const newId = result?.info?.public_id;

    if (type === 'video') {
      if (courseData.videoId && courseData.videoId !== newId) {
        await axios.delete(`http://localhost:3030/api/v1/auth/upload/file`, {
          params: { public_id: courseData.videoId }
        });
      }
      setCourseData(prevData => ({
        ...prevData,
        video: newUrl,
        videoId: newId
      }));
    } else {
      if (courseData.posterId && courseData.posterId !== newId) {
        await axios.delete(`http://localhost:3030/api/v1/auth/upload/file`, {
          params: { public_id: courseData.posterId }
        });
      }
      setCourseData(prevData => ({
        ...prevData,
        poster: newUrl,
        posterId: newId
      }));
    }
  };

  const handleRemoveFile = async (type: 'video' | 'poster') => {
    try {
      if (type === 'video' && courseData.videoId) {
        await axios.delete(`http://localhost:3030/api/v1/auth/upload/file`, {
          params: { public_id: courseData.videoId }
        });
        setCourseData(prevData => ({ ...prevData, video: '', videoId: '' }));
      } else if (type === 'poster' && courseData.posterId) {
        await axios.delete(`http://localhost:3030/api/v1/auth/upload/file`, {
          params: { public_id: courseData.posterId }
        });
        setCourseData(prevData => ({ ...prevData, poster: '', posterId: '' }));
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  return (
    <div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
          <InfoIcon />
          <h3 className="font-medium text-black dark:text-white ml-2">
            MEDIA
          </h3>
        </div>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col gap-5.5 p-6.5">
            <div>
              <label className="mb-3 block text-black dark:text-white">
                Video
              </label>
              {courseData.video ? (
                <div>
                  <a href={courseData.video} target="_blank" rel="noopener noreferrer">View Video</a>
                  <button onClick={() => handleRemoveFile('video')} className="ml-3 text-red-500">Remove</button>
                  <UploadWidget onUpload={(error, result, widget) => handleOnUpload(error, result, widget, 'video')}>
                    {({ open }) => (
                      <button
                        onClick={e => {
                          e.preventDefault();
                          open();
                        }}
                        className="ml-3 text-blue-500"
                      >
                        Change Video
                      </button>
                    )}
                  </UploadWidget>
                </div>
              ) : (
                <UploadWidget onUpload={(error, result, widget) => handleOnUpload(error, result, widget, 'video')}>
                  {({ open }) => (
                    <button
                      onClick={e => {
                        e.preventDefault();
                        open();
                      }}
                      className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                    >
                      Upload Video
                    </button>
                  )}
                </UploadWidget>
              )}
            </div>

            <div>
              <label className="mb-3 block text-black dark:text-white">
                Poster
              </label>
              {courseData.poster ? (
                <div>
                  <a href={courseData.poster} target="_blank" rel="noopener noreferrer">View Poster</a>
                  <button onClick={() => handleRemoveFile('poster')} className="ml-3 text-red-500">Remove</button>
                  <UploadWidget onUpload={(error, result, widget) => handleOnUpload(error, result, widget, 'poster')}>
                    {({ open }) => (
                      <button
                        onClick={e => {
                          e.preventDefault();
                          open();
                        }}
                        className="ml-3 text-blue-500"
                      >
                        Change Poster
                      </button>
                    )}
                  </UploadWidget>
                </div>
              ) : (
                <UploadWidget onUpload={(error, result, widget) => handleOnUpload(error, result, widget, 'poster')}>
                  {({ open }) => (
                    <button
                      onClick={e => {
                        e.preventDefault();
                        open();
                      }}
                      className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                    >
                      Upload Poster
                    </button>
                  )}
                </UploadWidget>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Media;
