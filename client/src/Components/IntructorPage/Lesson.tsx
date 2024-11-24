// src/components/Lesson.tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadWidget from './UploadWidget';
import axios from 'axios';

type LessonProps = {
  options: {
    title: string;
    contents: { text: string; file?: string; id?: string }[];
    quizzes?: any[];
  }[];
  addContent: (
    sectionTitle: string,
    content: string,
    file?: string,
    id?: string,
  ) => void;
  editContent: (
    sectionTitle: string,
    contentIndex: number,
    newContent: string,
    file?: string,
    id?: string,
    oldId?: string,
    oldurl?: string,
  ) => void;
  deleteContent: (
    sectionTitle: string,
    contentIndex: number,
    id?: string,
  ) => void;
  addQuiz: (sectionTitle: string, quiz: any) => void;
  editQuiz: (sectionTitle: string, quizIndex: number, updatedQuiz: any) => void;
  deleteQuiz: (sectionTitle: string, quizIndex: number) => void;
  editSection: (index: number, title: string) => void;
  deleteSection: (index: number) => void;
};

const Lesson: React.FC<LessonProps> = ({
  options,
  addContent,
  editContent,
  deleteContent,
  addQuiz,
  editQuiz,
  deleteQuiz,
  editSection,
  deleteSection,
  
}) => {
  const [openLesson, setOpenLesson] = React.useState(false);
  const [openQuiz, setOpenQuiz] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [currentOption, setCurrentOption] = React.useState<string | null>(null);
  const [newContent, setNewContent] = React.useState<string>('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [editingContentIndex, setEditingContentIndex] = React.useState<
    number | null
  >(null);
  const [quizTitle, setQuizTitle] = React.useState<string>('');
  const [answers, setAnswers] = React.useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = React.useState<string>('');
  const [editingQuizIndex, setEditingQuizIndex] = React.useState<number | null>(
    null,
  );
  const [url, updateUrl] = React.useState<string | undefined>();
  const [id, setId] = React.useState<string | undefined>();
  const [oldId, setOldId] = React.useState<string | undefined>();
  const [error, updateError] = React.useState<string | undefined>();

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

    const handleClickOpenLesson = (optionTitle: string, contentIndex?: number) => {
      setCurrentOption(optionTitle);
      if (contentIndex !== undefined) {
        const content = options.find((section) => section.title === optionTitle)?.contents[contentIndex];
        if (content) {
          setNewContent(content.text);
          setEditingContentIndex(contentIndex);
          updateUrl(content.file);
          setId(content.id);
          setOldId(content.id);
        }
      } else {
        setNewContent('');
        setEditingContentIndex(null);
        updateUrl(undefined);
        setId(undefined);
        setOldId(undefined);
      }
      setOpenLesson(true);
    };

  const handleCloseLesson = async () => {
    if (!editingContentIndex && id) {
      try {
        await axios.delete(`http://localhost:3030/api/v1/auth/upload/file`, {
          params: { public_id: id }
        });
      } catch (error) {
        console.error('Failed to delete uploaded file:', error);
      }
    }
    setOpenLesson(false);
    setCurrentOption(null);
    setNewContent('');
    setEditingContentIndex(null);
    setSelectedFile(null);
    updateUrl(undefined);
    setId(undefined);
    setOldId(undefined);
  };


  const handleAddOrEditContent = async () => {
    if (currentOption && newContent.trim() !== '') {
      const contentTitle = selectedFile ? selectedFile.name : newContent;
      if (editingContentIndex !== null) {
        // Xóa file cũ nếu đã thay đổi
        if (oldId && id && oldId !== id) {
          try {
            await axios.delete(`http://localhost:3030/api/v1/auth/upload/file`, {
              params: { public_id: oldId }
            });
          } catch (error) {
            console.error('Failed to delete old file:', error);
          }
        }
        editContent(currentOption, editingContentIndex, newContent, url, id, oldId);
      } else {
        addContent(currentOption, contentTitle, url, id);
      }
      setNewContent('');
      setOpenLesson(false);
      setEditingContentIndex(null);
      setSelectedFile(null);
      updateUrl(undefined);
      setId(undefined);
      setOldId(undefined);
    }
  };

  const handleClickOpenQuiz = (optionTitle: string, quizIndex?: number) => {
    setCurrentOption(optionTitle);
    if (quizIndex !== undefined) {
      const quiz = options.find((section) => section.title === optionTitle)
        ?.quizzes[quizIndex];
      if (quiz) {
        setQuizTitle(quiz.title);
        setAnswers(quiz.answers);
        setCorrectAnswer(quiz.correctAnswer);
        setEditingQuizIndex(quizIndex);
      }
    } else {
      setQuizTitle('');
      setAnswers(['', '', '', '']);
      setCorrectAnswer('');
      setEditingQuizIndex(null);
    }
    setOpenQuiz(true);
  };

  const handleCloseQuiz = () => {
    setOpenQuiz(false);
    setCurrentOption(null);
    setQuizTitle('');
    setAnswers(['', '', '', '']);
    setCorrectAnswer('');
    setEditingQuizIndex(null);
  };

  const handleAddQuiz = () => {
    if (
      currentOption &&
      quizTitle.trim() !== '' &&
      answers.every((answer) => answer.trim() !== '') &&
      correctAnswer.trim() !== ''
    ) {
      const quiz = { title: quizTitle, answers, correctAnswer };
      if (editingQuizIndex !== null) {
        editQuiz(currentOption, editingQuizIndex, quiz);
      } else {
        addQuiz(currentOption, quiz);
      }
      handleCloseQuiz();
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  function handleOnUpload(error: any, result: any, widget: any) {
    if (error) {
      updateError(error.message);
      widget.close({ quiet: true });
      return;
    }
    updateUrl(result?.info?.secure_url);
    setId(result?.info?.public_id);
  }

  return (
    <div>
      {options.map((option, index) => (
        <Accordion
          key={option.title}
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
        >
          <AccordionSummary
            aria-controls={`panel${index}bh-content`}
            id={`panel${index}bh-header`}
          >
            <div className="flex justify-between w-full">
              <div>
                <Typography sx={{ flexShrink: 0 }}>{option.title}</Typography>
              </div>
              <div className="flex space-x-1">
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => editSection(index, option.title)}
                  >
                    Edit Section
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => deleteSection(index)}
                  >
                    Delete Section
                  </Button>
                </div>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <div className="flex justify-between pb-7">
                <h4>Contents</h4>
                <Button
                  onClick={() => handleClickOpenLesson(option.title)}
                  variant="contained"
                >
                  Add Content
                </Button>
              </div>
              {option.contents.map((content, contentIndex) => (
                <div key={contentIndex} className="flex justify-between">
                  <div>
                    <a href={content.file} target="_blank" rel="noopener noreferrer">{content.text}</a>
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleClickOpenLesson(option.title, contentIndex)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() =>
                        deleteContent(option.title, contentIndex, content.id)
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between py-7">
                <h4>Quizzes</h4>
                <Button
                  onClick={() => handleClickOpenQuiz(option.title)}
                  variant="contained"
                >
                  Add Quiz
                </Button>
              </div>

              {option.quizzes?.map((quiz, quizIndex) => (
                <Accordion key={quizIndex}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{quiz.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div>
                      <h5>Answers</h5>
                      {quiz.answers.map((answer, index) => (
                        <p key={index}>{answer}</p>
                      ))}
                      <p>
                        <strong>Correct Answer:</strong> {quiz.correctAnswer}
                      </p>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleClickOpenQuiz(option.title, quizIndex)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => deleteQuiz(option.title, quizIndex)}
                      >
                        Delete
                      </Button>
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}

      <Dialog open={openLesson} onClose={handleCloseLesson}>
        <DialogTitle>
          {editingContentIndex !== null ? 'Edit Content' : 'Add Content'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {editingContentIndex !== null
              ? 'Edit the content for the section.'
              : 'Enter the content for the section.'}
          </DialogContentText>
          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Content"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          <UploadWidget onUpload={handleOnUpload}>
            {({ open }) => {
              function handleOnClick(e: React.MouseEvent<HTMLButtonElement>) {
                e.preventDefault();
                open();
              }
              return (
                <button
                  onClick={handleOnClick}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  Upload Image, Video,...
                </button>
              );
            }}
          </UploadWidget>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLesson} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddOrEditContent} color="primary">
            {editingContentIndex !== null ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openQuiz} onClose={handleCloseQuiz}>
        <DialogTitle>
          {editingQuizIndex !== null ? 'Edit Quiz' : 'Add Quiz'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the quiz details.</DialogContentText>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Quiz title"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {answers.map((answer, index) => (
            <input
              key={index}
              type="text"
              value={answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder={`Answer ${index + 1}`}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          ))}
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="Correct answer"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQuiz} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddQuiz} color="primary">
            {editingQuizIndex !== null ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Lesson;
