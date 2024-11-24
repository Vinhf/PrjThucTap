import { useEffect, useState } from 'react';
import { getTitleByCourseId } from '../../services/CourseService/TitleService';
import ViewLesson from './ViewLesson';

interface Title {
  titleId: number;
  courseId: string;
  titleName: string;
  passed: boolean;
}

interface ViewTitleProps {
  courseId: string;
}

const ViewTitle: React.FC<ViewTitleProps> = ({ courseId }) => {
  const [titles, setTitles] = useState<Title[]>([]);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const handleClick = (titleId: number) => {
    setExpandedItem(expandedItem === titleId ? null : titleId);
  };

  useEffect(() => {
    if (courseId) {
      fetchTitles(courseId);
    }
  }, [courseId]);

  const fetchTitles = async (courseId: string) => {
    try {
      const response = await getTitleByCourseId(courseId);
      setTitles(response.data);
    } catch (error) {
      console.error('Error fetching titles:', error);
    }
  };

  return (
    <div className="p-3">
      <table className="w-full table-auto border-collapse">
        <thead>
          {titles.length > 0 ? (
            titles.map((title) => (
              <div key={title.titleId}>
                <tr>
                  <th className="border-b-2 p-2 w-screen bg-slate-200">
                    <button
                      className="text-lg font-semibold text-left w-full"
                      onClick={() => handleClick(title.titleId)}
                    >
                      {title.titleName}
                    </button>
                  </th>
                </tr>
                {expandedItem === title.titleId && (
                  <tr>
                    <td colSpan={2} className="p-2 pl-6">
                      <ViewLesson titleId={title.titleId} />
                    </td>
                  </tr>
                )}
              </div>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="border p-2 text-center">No titles available</td>
            </tr>
          )}
        </thead>
      </table>
    </div>
  );
};

export default ViewTitle;
