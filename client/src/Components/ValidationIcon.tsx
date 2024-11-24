import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface ValidationIconProps {
  isValid: boolean;
}

const ValidationIcon: React.FC<ValidationIconProps> = ({ isValid }) => {
  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
      {isValid ? (
        <FaCheckCircle className="text-green-500" />
      ) : (
        <FaTimesCircle className="text-red-500" />
      )}
    </div>
  );
};

export default ValidationIcon;
