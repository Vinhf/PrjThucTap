import React, { useState } from 'react';
import axios from 'axios';
import { useEmail } from '../../utils/auth';

const PaymentForm: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [language, setLanguage] = useState('vn');
    const userEmail = useEmail();
    const [errorMessage, setErrorMessage] = useState('');

    // Function to format the amount with dots as thousand separators
    const formatAmount = (value: string) => {
        if (!value) return '';
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Function to remove dots from the amount
    const removeDots = (value: string) => {
        return value.replace(/\./g, '');
    };

    // Handle input change and remove non-numeric characters
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        // Ensure the value is within the allowed range
        if (Number(value) >= 1000 && Number(value) < 1000000000) {
            setAmount(formatAmount(value));
            setErrorMessage(''); // Clear error message
        } else if (Number(value) >= 1000000000) {
            setAmount(formatAmount('999999999')); // Cap at the maximum allowed value
            setErrorMessage(''); // Clear error message
        } else {
            setAmount(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const rawAmount = removeDots(amount);
        // Check if amount is valid before making the request
        if (Number(rawAmount) < 10000 || Number(rawAmount) >= 1000000000) {
            setErrorMessage('Please enter an amount between 5,000 and 1,000,000,000 VND');
            return;
        }
        try {
            const response = await axios.get(import.meta.env.VITE_SERVERHOST+'/api/v1/auth/create_payment', {
                params: {
                    amount: rawAmount, // Send amount without dots
                    language,
                    email: userEmail // Add email to the request parameters
                }
            });
            console.log('AMOUNT: ', rawAmount)
            console.log('Response:', response.data.url);
            console.log('Response full: ', response.data)
            if (response.data && response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error('Payment creation failed:', error);
        }
    };

    return (
        <div>
            <div className="w-full max-w-md mx-auto p-8 space-y-8 bg-auto shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold text-center text-gray-900">Enter Payment Information</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Payment Type</label>
                        <input
                            type="text"
                            value="Add money to wallet"
                            disabled
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Payment Account</label>
                        <input
                            type="text"
                            value={userEmail || ''}
                            disabled
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Amount</label>
                        <input
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            required
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                            style={{ MozAppearance: 'textfield' }} // Remove increment buttons in Firefox
                            onKeyDown={(e) => (e.key === 'e' || e.key === '-' || e.key === '+') && e.preventDefault()} // Prevent entering invalid characters
                        />
                        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Language</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            required
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="vn">Vietnamese</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="block w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            PAY
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;
