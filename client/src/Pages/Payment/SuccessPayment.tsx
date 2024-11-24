import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import { useEmail } from '../../utils/auth';

const SuccessPayment: React.FC = () => {
    const userEmail = useEmail();
    const { amount } = useParams<{ amount: string }>();
    const navigate = useNavigate();
    
    // Function to format the amount with dots as thousand separators
    const formatAmount = (value: string) => {
        if (!value) return '';
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Log the amount to verify it
    console.log('Amount:', amount);

    const handleGoBack = () => {
        navigate('/protected/wallet');
    };

    return (
        <DefaultLayout>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
                    <h1 className="text-4xl font-bold text-center text-gray-900">PAYMENT SUCCESSFUL</h1>
                    <div className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-24 h-24 text-green-500 mr-4"><path fill="#2ecc71" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
                        <p className="text-lg font-medium text-green-500">Payment successful!</p>
                    </div>
                    <div className="space-y-4">
                        <p className="text-lg font-medium text-gray-700">Your Email: {userEmail}</p>
                        <p className="text-lg font-medium text-gray-700">Amount: {formatAmount(amount ?? '')} VND</p>
                    </div>
                    <button
                        className="w-full py-2 mt-4 text-lg font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
                        onClick={handleGoBack}
                    >
                        Go back to your wallet
                    </button>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default SuccessPayment;
