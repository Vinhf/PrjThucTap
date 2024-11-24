import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    Typography,
    List,
    ListItem,
    ListItemText,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress,
    IconButton,
    Snackbar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PauseIcon from '@mui/icons-material/Pause';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CompletionChart from './CompletionChart';
import Header from '../Components/Header';
import Container from './Container';
import VideoPlayer from './VideoPlayer';
import QuizPlayer from './QuizPlayer';
import { useEmail } from '../utils/auth';
import { getUserByEmail } from '../services/UserGetAll';

interface Lesson {
    lessonId: number;
    titleId: number;
    lessonName: string;
    videoLink: string;
    passed: boolean;
}

interface QuizDTO {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    isPassed: boolean;
}

interface Title {
    titleId: number;
    courseId: number;
    titleName: string;
    lessons: Lesson[];
    quizzes: QuizDTO[];
    passed: boolean;
}

interface Course {
    courseId: number;
    userId: number;
    categoryId: number;
    courseName: string;
    description: string;
    videoLink: string;
    imgLink: string;
    updateDate: string;
    status: string;
    price: string;
}

const BASE_URL = import.meta.env.VITE_SERVERHOST+'/api/v1';

const DetailCourseEnroll: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [titles, setTitles] = useState<Title[]>([]);
    const [selectedTitleId, setSelectedTitleId] = useState<number | null>(null);
    const [titleData, setTitleData] = useState<Map<number, Title>>(new Map());
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [lessonResults, setLessonResults] = useState<Record<number, boolean>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [selectedQuiz, setSelectedQuiz] = useState<QuizDTO | null>(null);
    const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
    const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
    const completedTitlesCount = titles.filter(title => title.passed).length;
    const totalTitlesCount = titles.length;
    const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
    const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
    
const [userId, setUserId] = useState<number | null>(null);
const email = useEmail();

useEffect(() => {
  const fetchUser = async () => {
    try {
      if (email) {
        const Userdate = await getUserByEmail(email);
        setUserId(Userdate.data?.userId);
      }
    } catch (error) {
      console.error('Error fetching course data', error);
    } finally {
      setLoading(false);
    }
  };
  fetchUser();
}, [userId, email]);
    useEffect(() => {
        if (id) {
            axios.get<Course>(`${BASE_URL}/auth/courses/${id}`)
                .then(response => {
                    console.log('Course data:', response.data);
                    setCourse(response.data);
                    return axios.get<Title[]>(`${BASE_URL}/auth/titles/getByCourseId/${id}`);
                })
                .then(response => {
                    console.log('Titles data:', response.data);
                    setTitles(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching data", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    const handleTitleClick = (titleId: number) => {
        if (titleId === selectedTitleId) {
            setSelectedTitleId(null);
            setSelectedVideo(null);
            setSelectedQuiz(null);
            return;
        }

        const title = titles.find(t => t.titleId === titleId);
        if (title) {
            axios.get<Lesson[]>(`${BASE_URL}/lessons/by-title/${titleId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then(lessonsResponse => {
                    return axios.get<QuizDTO[]>(`${BASE_URL}/auth/quiz/by-title/${titleId}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    })
                    .then(quizzesResponse => {
                        const updatedTitle = { ...title, lessons: lessonsResponse.data, quizzes: quizzesResponse.data };
                        setTitleData(prev => new Map(prev).set(titleId, updatedTitle));
                        setSelectedTitleId(titleId);
                        setSelectedVideo(null);
                        setSelectedQuiz(null);
                    });
                })
                .catch((error) => {
                    console.error("Error fetching lessons or quizzes", error);
                });
        }
    };
    const fetchLessonProgress = async (lessonId: number) => {
        try {
            const response = await axios.get(`${BASE_URL}/auth/enrollment/lessonProgress`, {
                params: {
                    userId: userId, // replace with actual user ID
                    lessonId
                }
            });
            return response.data.passed;
        } catch (error) {
            console.error('Error fetching user lesson progress:', error);
            return false;
        }
    };
    
    const handleLessonClick = async (lessonId: number, videoLink: string) => {
        setSelectedVideo(videoLink);
        setSelectedQuiz(null);
        setSelectedLessonId(lessonId); // Cập nhật ID bài học được chọn
    
        try {
            // Đánh dấu bài học là đã hoàn thành
            await axios.put(`${BASE_URL}/auth/enrollment/markLessonAsPassed`, null, {
                params: {
                    userId: userId, // thay thế với ID người dùng thực tế
                    lessonId
                }
            });
    
            // Fetch và cập nhật trạng thái hoàn thành bài học
            const isPassed = await fetchLessonProgress(lessonId);
            setLessonResults(prev => ({
                ...prev,
                [lessonId]: isPassed
            }));
    
            setNotificationOpen(true);
        } catch (error) {
            console.error("Error updating lesson status", error);
        }
    };
    
    

    const handleQuizClick = (quiz: QuizDTO) => {
        setSelectedQuiz(quiz);
        setSelectedVideo(null);
        setSelectedQuizId(quiz.id); // Set selected quiz ID
    
        axios.get(`${BASE_URL}/auth/enrollment/quizProgress`, {
            params: {
                userId: 1,
                quizId: quiz.id
            }
        })
        .then(response => {
            const isPassed = response.data.correct;
            setQuizResult(prev => ({ ...prev, [quiz.id]: isPassed }));
        })
        .catch(error => {
            console.error('Error fetching quiz progress:', error);
        });
    };

    const handleAnswerChange = (quizId: number, answer: string) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [quizId]: answer
        }));
    };

    const handleSubmitQuiz = (quiz: QuizDTO) => {
        const userAnswer = userAnswers[quiz.id];

        if (userAnswer === undefined) {
            console.error("No answer found for quiz ID:", quiz.id);
            return;
        }

        const isCorrect = userAnswer === quiz.correctAnswer;

        setQuizResult(prev => ({ ...prev, [quiz.id]: isCorrect }));

        axios.post(`${BASE_URL}/auth/enrollment/submitQuizAnswer`, null, {
            params: {
                userId: userId, // replace with actual user ID
                quizId: quiz.id,
                answer: userAnswer
            }
        })
        .then(() => {
            handleQuizAnswered(quiz.id, isCorrect);
        })
        .catch(error => {
            console.error("Error submitting quiz answer", error);
        });
    };

    const handleQuizAnswered = (quizId: number, isCorrect: boolean) => {
        setQuizResult(prev => ({ ...prev, [quizId]: isCorrect }));

        if (isCorrect) {
            setTitleData(prev => {
                const newTitleData = new Map(prev);
                const updatedTitle = { ...newTitleData.get(selectedTitleId!) };
                updatedTitle.quizzes = updatedTitle.quizzes.map(quiz =>
                    quiz.id === quizId ? { ...quiz, passed: true } : quiz
                );
                newTitleData.set(selectedTitleId!, updatedTitle);
                return newTitleData;
            });
        }
    };

    const handleCloseVideo = () => {
        setSelectedVideo(null);
    };

    const handleCloseQuiz = () => {
        setSelectedQuiz(null);
    };

    const handleCloseNotification = () => {
        setNotificationOpen(false);
    };

    const areAllQuizzesPassed = (title: Title): boolean => {
        return title.quizzes.every(quiz => quiz.passed);
    };

    const [quizResult, setQuizResult] = useState<Record<number, boolean>>({});
  
    
    
    const fetchUserProgress = async (quizId: number) => {
        try {
            const response = await axios.get(`${BASE_URL}/auth/enrollment/quizProgress`, {
                params: {
                    userId: userId, // Giữ nguyên userId là 1
                    quizId: quizId
                }
            });
            if (response.data.correct) {
                setQuizResult(prev => ({ ...prev, [quizId]: true }));
                console.log(response.data.correct + "Hello");
            }
        } catch (error) {
            console.error('Error fetching user quiz progress:', error);
        }
    };

    useEffect(() => {
        titles.forEach(title => {
            title.quizzes.forEach(quiz => {
                fetchUserProgress(quiz.id);
            });
        });
    }, [titles]);
    const sendCertificateEmail = async () => {
        try {
            await axios.post(`${BASE_URL}/auth/mail/certificate`, {
                email: email,
                courseId: course?.courseId,
                instructorId: course?.userId
            });
            console.log("Certificate email sent successfully!");
        } catch (error) {
            console.error("Error sending certificate email", error);
        }
    };

    // Check and send certificate email when all titles are completed
    useEffect(() => {
        const checkAndSendCertificate = async () => {
            if (completedTitlesCount === totalTitlesCount && totalTitlesCount > 0) {
                await sendCertificateEmail();
            }
        };

        checkAndSendCertificate();
    }, [completedTitlesCount, totalTitlesCount]);


    return (
        <>
            <Container>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Typography variant="h4" style={{ flexGrow: 1 }}>
                                {course?.courseName}
                            </Typography>
                            <CompletionChart
                                totalTitles={totalTitlesCount}
                                completedTitles={completedTitlesCount}
                            />
                        </div>
    
                        <List>
                            {titles.map(title => (
                                <Accordion key={title.titleId} expanded={title.titleId === selectedTitleId} onChange={() => handleTitleClick(title.titleId)}>
                                    <AccordionSummary
                                        expandIcon={title.titleId === selectedTitleId ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    >
                                        <Typography variant="body1" style={{ flexGrow: 1 }}>
                                            {title.titleName}
                                        </Typography>
                                        {areAllQuizzesPassed(title) && (
                                            <Typography style={{ color: 'green', marginLeft: '10px' }}>Done</Typography>
                                        )}
                                        {areAllQuizzesPassed(title) && (
                                            <CheckCircleIcon style={{ color: 'green', marginLeft: '10px' }} />
                                        )}
                                    </AccordionSummary>
    
                                    <AccordionDetails>
                                        <div>
                                            <Typography variant="h6" gutterBottom>
                                                Lessons
                                            </Typography>
                                            <List>
                                                {titleData.get(title.titleId)?.lessons.map(lesson => (
                                                    <ListItem
                                                        button
                                                        key={lesson.lessonId}
                                                        onClick={() => handleLessonClick(lesson.lessonId, lesson.videoLink)}
                                                        style={{
                                                            borderLeft: selectedLessonId === lesson.lessonId ? '4px solid green' : 'none',
                                                            paddingLeft: '16px' // Make room for the border
                                                        }}
                                                    >
                                                        <ListItemText primary={`Lesson ${lesson.lessonName}`} />
                                                        {lessonResults[lesson.lessonId] === true && (
                                                            <CheckCircleIcon style={{ color: 'green' }} />
                                                        )}
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </div>
    
                                        <div style={{ marginTop: '20px' }}>
                                            <Typography variant="h6" gutterBottom>
                                                Quizzes
                                            </Typography>
                                            <List>
                                                {titleData.get(title.titleId)?.quizzes.map((quiz, index) => (
                                                    <ListItem
                                                        button
                                                        key={quiz.id}
                                                        onClick={() => handleQuizClick(quiz)}
                                                        style={{
                                                            borderLeft: selectedQuizId === quiz.id ? '4px solid green' : 'none',
                                                            paddingLeft: '16px' // Make room for the border
                                                        }}
                                                    >
                                                        <ListItemText primary={`Quiz ${index + 1}`} />
                                                        {quizResult[quiz.id] ? (
                                                            <CheckCircleIcon style={{ color: 'green' }} />
                                                        ) : null}
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </List>
                    </>
                )}
    
                <Snackbar
                    open={notificationOpen}
                    onClose={handleCloseNotification}
                    message="Lesson marked as completed!"
                    autoHideDuration={3000}
                />
            </Container>
            
            {selectedVideo && (
                <VideoPlayer videoLink={selectedVideo} onClose={handleCloseVideo} />
            )}
            {selectedQuiz && (
                <QuizPlayer
                    quiz={selectedQuiz}
                    userAnswers={userAnswers}
                    onAnswerChange={handleAnswerChange}
                    onSubmitQuiz={handleSubmitQuiz}
                    onClose={handleCloseQuiz}
                    userId={userId}
                />
            )}
        </>
    );
};    
export default DetailCourseEnroll;