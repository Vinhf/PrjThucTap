import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  BasicStep,
  CurriculumStep,
  MediaStep,
  PriceStep,
  TotalStep,
} from '../../routes/CreateCourseForm/StepComponents';
import { useLocation } from 'react-router-dom';
import { getSessionDataById } from '../../services/CourseService/CourseService';

const steps = ['Basic', 'Curriculum', 'Media', 'Price', 'Total'];

export default function CreateCourseForm() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>({});
  const location = useLocation();
  const { state } = location;

  React.useEffect(() => {
    const fetchAndStoreCourseData = async () => {
      if (state?.course) {
        const response = await getSessionDataById(state?.course);
        const courseData = response.data;
        sessionStorage.setItem('courseData', JSON.stringify(courseData));
      }
    }
    fetchAndStoreCourseData();
  }, [state?.mode, state?.course]);

  React.useEffect(() => {
    // Function to clear session storage
    const clearSessionData = () => {
      sessionStorage.removeItem('courseData');
    };

    // Add event listener
    window.addEventListener('beforeunload', clearSessionData);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', clearSessionData);
    };
  }, []);

  const totalSteps = () => steps.length;

  const completedSteps = () => Object.keys(completed).length;

  const isLastStep = () => activeStep === totalSteps() - 1;

  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = (stepIndex: number) => {
    const newCompleted = completed;
    newCompleted[stepIndex] = true;
    setCompleted(newCompleted);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <BasicStep onComplete={() => handleComplete(0)} />;
      case 1:
        return <CurriculumStep onComplete={() => handleComplete(1)} />;
      case 2:
        return <MediaStep onComplete={() => handleComplete(2)} />;
      case 3:
        return <PriceStep onComplete={() => handleComplete(3)} />;
      case 4:
        return <TotalStep onComplete={() => handleComplete(4)} />;
    }
  };

  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Stepper nonLinear activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color="inherit" onClick={handleStep(index)}>
                <div className="block dark:text-white">{label}</div>
              </StepButton>
            </Step>
          ))}
        </Stepper>
        <div>
          {allStepsCompleted() ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you're finished
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                {getStepContent(activeStep)}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  <div className="block dark:text-slate-500">Back</div>
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleNext} sx={{ mr: 1 }}>
                  Next
                </Button>
                {activeStep !== steps.length &&
                  (completed[activeStep] ? (
                    <Typography
                      variant="caption"
                      sx={{ display: 'inline-block' }}
                    >
                      Step {activeStep + 1} already completed
                    </Typography>
                  ) : (
                    <Button onClick={() => handleComplete(activeStep)}>
                      {completedSteps() === totalSteps() - 1
                        ? 'Finish'
                        : 'Complete Step'}
                    </Button>
                  ))}
              </Box>
            </React.Fragment>
          )}
        </div>
      </Box>
    </div>
  );
}
