import { useEffect, useState } from "react";
import { getLessonBytitleId } from '../../services/CourseService/LessonService';

interface Lesson {
  lessonId: string;
  titleId: number;
  lessonName: string;
  videoLink: string;
}

const ViewLesson: React.FC<{ titleId: number }> = ({ titleId }) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  useEffect(() => {
    if (titleId) {
      console.log('check id cho lesson: ' + titleId);
      fetchLesson(titleId);
    } else {
      console.log('check id khoong co cho lesson: ');
    }
  }, [titleId]);

  const fetchLesson = async (titleId: number) => {
    getLessonBytitleId(titleId)
      .then((response) => {
        setLesson(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div>
      {lesson ? ( // Kiểm tra nếu titles không phải null
        lesson.map((Lesson) => (
          <div key={Lesson.titleId}>
            <p>{Lesson.lessonName}</p>
          </div>
        ))
      ) : (
        <p>No lesson available</p> // Hiển thị nếu titles là null
      )}
    </div>
  );
};

export default ViewLesson;
