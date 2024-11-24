import React, { useLayoutEffect } from 'react';
import axios from 'axios';

import {
  Button,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green } from '@mui/material/colors';

interface QuizPlayerProps {
  quiz: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
  };
  onClose: () => void;
  onAnswerChange: (id: number, answer: string) => void;
  onSubmit: (quiz: { id: number; correctAnswer: string }) => void;
  onQuizAnswered: (id: number, isCorrect: boolean) => void;
  userId: number; // ID của người dùng, nhưng bạn đang sử dụng cố định là 1
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({
  quiz,
  onClose,
  onAnswerChange,
  onSubmit,
  onQuizAnswered,
  userId,
}) => {
  const [selectedAnswer, setSelectedAnswer] = React.useState<string>('');
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  console.log('test user quiz: ' + userId);
  const BASE_URL = import.meta.env.VITE_SERVERHOST + '/api/v1';
  useLayoutEffect(() => {
    fetchUserProgress();
  }, [userId]);
  const fetchUserProgress = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/auth/enrollment/quizProgress`,
        {
          params: {
            userId: userId, // Giữ nguyên userId là 1
            quizId: quiz.id,
          },
        },
      );
      setIsCorrect(response.data.correct);
      console.log(response.data.correct + 'Hello');
    } catch (error) {
      console.error('Error fetching user quiz progress:', error);
    }
  };

  const checkProgress = async () => {
    const isCorrect = await fetchUserProgress(userId, quiz.id); // Thay đổi userId và quizId theo nhu cầu
    console.log(isCorrect); // Sẽ in ra true hoặc false
  };

  React.useEffect(() => {
    fetchUserProgress(); // Lấy dữ liệu khi component mount
  }, [quiz.id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedAnswer = (event.target as HTMLInputElement).value;
    setSelectedAnswer(selectedAnswer); // Cập nhật câu trả lời đã chọn
    onAnswerChange(quiz.id, selectedAnswer);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/enrollment/submitQuizAnswer`,
        null,
        {
          params: {
            userId: userId, // Giữ nguyên userId là 1
            quizId: quiz.id,
            answer: selectedAnswer,
          },
        },
      );

      const response1 = await axios.post(`${BASE_URL}/auth/quiz/check`, null, {
        params: {
          id: quiz.id,
          answer: selectedAnswer,
        },
      });
      const isCorrectAnswer = response.data.correct;
      setIsCorrect(isCorrectAnswer);
      console.log('Có dung ko?' + isCorrectAnswer);
      setIsSubmitted(true);

      onAnswerChange(quiz.id, selectedAnswer);
      onSubmit(quiz);
      onQuizAnswered(quiz.id, isCorrectAnswer);
    } catch (error) {
      console.error('Error submitting quiz answer:', error);
    }
  };

  // Đặt lại trạng thái khi quiz thay đổi
  React.useEffect(() => {
    setIsSubmitted(false);
    setIsCorrect(null);
  }, [quiz.id]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '24.5%',
        left: '50%',
        width: '40vw',
        maxWidth: '600px',
        height: 'auto',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflowY: 'auto',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: '10px', right: '10px' }}
      >
        Close
      </button>
      <Typography
        variant="h6"
        style={{ marginBottom: '20px', textAlign: 'left' }}
      >
        {quiz.question}
      </Typography>
      <FormControl component="fieldset" style={{ width: '100%' }}>
        <RadioGroup
          value={selectedAnswer}
          onChange={handleChange}
          style={{ width: '100%' }}
        >
          {quiz.options && quiz.options.length > 0 ? (
            quiz.options.map((option, index) => (
              <FormControlLabel
                key={`${option}-${index}`} // Sử dụng giá trị của tùy chọn kết hợp với chỉ số để đảm bảo uniqueness
                value={option}
                control={<Radio />}
                label={option}
                style={{ textAlign: 'left' }}
              />
            ))
          ) : (
            <Typography variant="body1">No options available</Typography>
          )}
        </RadioGroup>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ alignSelf: 'flex-start', marginTop: '20px' }}
          disabled={isSubmitted} // Disable button after submission
        >
          Submit
        </Button>
      </FormControl>
      {(isSubmitted || isCorrect !== null) && (
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            alignSelf: 'flex-start',
          }}
        >
          {isCorrect ? (
            <>
              <CheckCircleIcon
                style={{ color: green[500], marginRight: '10px' }}
              />
              <Typography variant="body1" color="textPrimary">
                Correct
              </Typography>
            </>
          ) : (
            <Typography variant="body1" color="textPrimary">
              Incorrect
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPlayer;
