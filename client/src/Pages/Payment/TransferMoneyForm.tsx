import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../../layout/DefaultLayout';
import { useEmail } from '../../utils/auth'; // Adjust path if needed
import authService from '../../hooks/Auth/authService';

const formatAmount = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const TransferMoneyForm: React.FC = () => {
    const [recipientEmail, setRecipientEmail] = useState<string>('');
    const [amount, setAmount] = useState<number>();
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const userEmail = useEmail();

    const handleRecipientEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRecipientEmail(e.target.value);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/\./g, ''); // Remove existing dots
        const formatted = formatAmount(input);
        setAmount(Number(input)); // Store the numerical value without formatting
        e.target.value = formatted; // Set the formatted value back to the input
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    };

    const dataFrom = {
        data: {
            userEmail: userEmail,
            recipientEmail: recipientEmail,
            amount: amount,
            content: content,
        },
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        console.log(dataFrom.data);

        try {
            const response = await authService.payment(dataFrom.data);

            setError('');
            if (response !== null) {
                navigate('/protected/wallet');
            } else {
                setError('Error transferring money');
            }
        } catch (error) {
            setError('Error transferring money');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-12">
            <div className="flex items-center justify-center h-full">
                <div className="w-full max-w-4xl p-8 space-y-6 bg-auto shadow-lg rounded-lg">
                    <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Transfer Money
                            </h1>
                            </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Recipient Email:
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={recipientEmail}
                                    onChange={handleRecipientEmailChange}
                                    placeholder="Enter recipient's email"
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Amount:
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={amount !== undefined ? formatAmount(amount.toString()) : ''}
                                    onChange={handleAmountChange}
                                    placeholder="Enter amount"
                                    required
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    style={{ MozAppearance: 'textfield' }} // Remove increment buttons in Firefox
                                    onKeyDown={(e) => (e.key === 'e' || e.key === '-' || e.key === '+') && e.preventDefault()}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Content:
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={content}
                                    onChange={handleContentChange}
                                    placeholder="Enter transfer content"
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 text-center">
                                <p className="text-sm font-medium text-red-500">{error}</p>
                            </div>
                        )}

                        <div className="mb-4">
                            <button
                                type="submit"
                                className={`w-full cursor-pointer rounded-lg border border-primary p-4 text-white transition ${
                                    loading ? 'bg-opacity-70' : 'hover:bg-opacity-90 bg-primary'
                                }`}
                                disabled={loading}
                            >
                                {loading ? 'Transferring...' : 'Transfer Money'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            </div>
    );
};

export default TransferMoneyForm;
