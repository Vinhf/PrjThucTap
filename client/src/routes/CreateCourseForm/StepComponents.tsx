import * as React from 'react';
import BasicInformation from '../../Components/IntructorPage/BasicInformation';
import Curriculum from '../../Components/IntructorPage/Curriculum';
import Media from '../../Components/IntructorPage/Media';
import Price from '../../Components/IntructorPage/Price';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';
import Total from '../../Components/IntructorPage/Total';

interface StepProps {
  onComplete: () => void;
}

export const BasicStep: React.FC<StepProps> = ({ onComplete }) => {
  return <BasicInformation onComplete={onComplete} />;
};

export const CurriculumStep: React.FC<StepProps> = ({ onComplete }) => {
 return <Curriculum onComplete={onComplete} />
};

export const MediaStep: React.FC<StepProps> = ({ onComplete }) => {
  return <Media onComplete={onComplete} />
};

export const PriceStep: React.FC<StepProps> = ({ onComplete }) => {
  return <Price onComplete={onComplete} />
};

export const TotalStep: React.FC<StepProps> = ({onComplete }) => {
  return <Total onComplete={onComplete} />
};
