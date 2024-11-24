import React, { useEffect, useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import Lesson from './Lesson';
import axios from 'axios';

interface CurriculumProps {
  onComplete: () => void; // Notify the parent component (CreateCourseForm) that the step is complete
}

const Curriculum: React.FC<CurriculumProps> = ({ onComplete }) => {
  const [courseData, setCourseData] = useState(() => {
    const savedData = sessionStorage.getItem('courseData');
    return savedData ? JSON.parse(savedData) : { courseTitle: '', shortDescription: '', sections: [] };
  });

  const [newSection, setNewSection] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);
  const [editingSection, setEditingSection] = useState<{ index: number, title: string } | null>(null);

  useEffect(() => {
    sessionStorage.setItem('courseData', JSON.stringify(courseData));

    // Check if there are any sections
    if (courseData.sections.length > 0) {
      onComplete(); // Notify the parent component that this step is complete
    }
  }, [courseData, onComplete]);

  const handleAddSection = () => {
    if (newSection.trim() !== '') {
      setCourseData(prevData => ({
        ...prevData,
        sections: [...prevData.sections, { title: newSection, contents: [], quizzes: [] }]
      }));
      setNewSection('');
      setShowInput(false);
    }
  };

  const handleEditSection = () => {
    if (editingSection) {
      setCourseData(prevData => ({
        ...prevData,
        sections: prevData.sections.map((section, index) =>
          index === editingSection.index ? { ...section, title: editingSection.title } : section
        )
      }));
      setEditingSection(null);
    }
  };

  const handleDeleteSection = (index: number) => {
    setCourseData(prevData => ({
      ...prevData,
      sections: prevData.sections.filter((_, i) => i !== index)
    }));
  };

  const handleAddContent = async (sectionTitle: string, content: string, file?: string, id?: string) => {
    setCourseData(prevData => ({
      ...prevData,
      sections: prevData.sections.map(section =>
        section.title === sectionTitle
          ? { ...section, contents: [...section.contents, { text: content, file, id }] }
          : section
      )
    }));
  };

  const handleEditContent = async (sectionTitle: string, contentIndex: number, updatedContent: string, file?: string, id?: string, oldId?: string) => {
    if (oldId && id && oldId !== id) {
      try {
        await axios.delete(`http://localhost:3030/api/v1/auth/upload/file`, {
          params: { public_id: oldId }
        });
      } catch (error) {
        console.error('Failed to delete old file:', error);
      }
    }

    setCourseData(prevData => ({
      ...prevData,
      sections: prevData.sections.map(section =>
        section.title === sectionTitle
          ? {
              ...section,
              contents: section.contents.map((content, index) =>
                index === contentIndex ? { text: updatedContent, file, id } : content
              )
            }
          : section
      )
    }));
  };

  const handleDeleteContent = async (sectionTitle: string, contentIndex: number, contentId?: string) => {
    if (contentId) {
      try {
        await axios.delete(`http://localhost:3030/api/v1/auth/upload/file`, {
          params: { public_id: contentId }
        });
      } catch (error) {
        console.error('Failed to delete content:', error);
      }
    }

    setCourseData(prevData => ({
      ...prevData,
      sections: prevData.sections.map(section =>
        section.title === sectionTitle
          ? {
              ...section,
              contents: section.contents.filter((_, index) => index !== contentIndex)
            }
          : section
      )
    }));
  };

  const handleAddQuiz = (sectionTitle: string, quiz: any) => {
    setCourseData(prevData => ({
      ...prevData,
      sections: prevData.sections.map(section =>
        section.title === sectionTitle
          ? { ...section, quizzes: [...(section.quizzes || []), quiz] }
          : section
      )
    }));
  };

  const handleEditQuiz = (sectionTitle: string, quizIndex: number, updatedQuiz: any) => {
    setCourseData(prevData => ({
      ...prevData,
      sections: prevData.sections.map(section =>
        section.title === sectionTitle
          ? {
              ...section,
              quizzes: section.quizzes.map((quiz, index) =>
                index === quizIndex ? updatedQuiz : quiz
              )
            }
          : section
      )
    }));
  };

  const handleDeleteQuiz = (sectionTitle: string, quizIndex: number) => {
    setCourseData(prevData => ({
      ...prevData,
      sections: prevData.sections.map(section =>
        section.title === sectionTitle
          ? {
              ...section,
              quizzes: section.quizzes.filter((_, index) => index !== quizIndex)
            }
          : section
      )
    }));
  };

  return (
    <div>
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex"></div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center text-center">
          <div className="flex items-center">
            <InfoIcon />
            <h3 className="font-medium text-black dark:text-white ml-2">
              Curriculum
            </h3>
          </div>

          <button
            onClick={() => setShowInput(true)}
            className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-5 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            New Section
          </button>
        </div>

        {showInput && (
          <div className="p-6.5">
            <input
              type="text"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              placeholder="New section name"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <button
              onClick={handleAddSection}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-primary py-3 px-5 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Add Section
            </button>
          </div>
        )}

        {editingSection && (
          <div className="p-6.5">
            <input
              type="text"
              value={editingSection.title}
              onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
              placeholder="Edit section name"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            <button
              onClick={handleEditSection}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-primary py-3 px-5 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Edit Section
            </button>
          </div>
        )}
      </div>

      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex"></div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <Lesson
          options={courseData.sections}
          addContent={handleAddContent}
          editContent={handleEditContent}
          deleteContent={handleDeleteContent}
          addQuiz={handleAddQuiz}
          editQuiz={handleEditQuiz}
          deleteQuiz={handleDeleteQuiz}
          editSection={(index: number, title: string) => setEditingSection({ index, title })}
          deleteSection={handleDeleteSection}
        />
      </div>
    </div>
  );
};

export default Curriculum;
