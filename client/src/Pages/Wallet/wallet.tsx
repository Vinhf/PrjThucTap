import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEmail } from '../../utils/auth';
import Header from '../../Components/Header';

const Wallet: React.FC = () => {
    const [balance, setBalance] = useState<number>(0);
    const [fullName, setFullName] = useState<string>('');
    const [transactions, setTransactions] = useState<any[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const userEmail = useEmail();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [monthYear, setMonthYear] = useState<string>('');

    useEffect(() => {
        const fetchWalletData = async () => {
            setLoading(true);
            setError(null);

            try {
                if (!userEmail) {
                    throw new Error('User email not found');
                }

                const balanceResponse = await axios.get(import.meta.env.VITE_SERVERHOST+'/api/v1/auth/balance', {
                    params: { email: userEmail },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const fullNameResponse = await axios.get(import.meta.env.VITE_SERVERHOST+'/api/v1/auth/user-fullname', {
                    params: { email: userEmail },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const transactionsResponse = await axios.get(import.meta.env.VITE_SERVERHOST+'/api/v1/auth/transactions', {
                    params: { email: userEmail },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                setFullName(fullNameResponse.data);
                setBalance(balanceResponse.data);
                const sortedTransactions = (Array.isArray(transactionsResponse.data) ? transactionsResponse.data : [])
                    .sort((a, b) => new Date(b.createDate).getTime() - new Date(a.createDate).getTime());
                setTransactions(sortedTransactions);
                setFilteredTransactions(sortedTransactions);
            } catch (error) {
                console.error('Error fetching wallet data:', error);
                setError('Error fetching wallet data');
            } finally {
                setLoading(false);
            }
        };

        if (userEmail) {
            fetchWalletData();
        }
    }, [userEmail]);

    const handleGoBack = () => {
        navigate('/');
    };

    const handleTopUp = () => {
        navigate('/wallet/paymentselection');
    };

    const handleTransfer = () => {
        navigate('/transfer');
    };

    const handleFilterTransactions = () => {
        if (!monthYear) {
            setFilteredTransactions(transactions);
            return;
        }

        const [selectedYear, selectedMonth] = monthYear.split('-').map(Number);

        const filtered = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.createDate);
            return (
                transactionDate.getFullYear() === selectedYear &&
                transactionDate.getMonth() + 1 === selectedMonth
            );
        });

        setFilteredTransactions(filtered);
    };


    useEffect(() => {
        handleFilterTransactions();
    }, [monthYear, transactions]);

    return (
        <div className="container mx-auto py-12">
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100">
                {loading && (
                    <p className="text-center text-gray-600">Loading...</p>
                )}
                {!loading && error && (
                    <p className="text-center text-red-500">{error}</p>
                )}
                {!loading && !error && fullName && (
                    <div className="space-y-4">
                        <div className="flex flex-col items-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                {fullName}'s Account Balance
                            </h1>
                            <p className="text-3xl font-extrabold text-gray-800">
                                {balance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </p>
                        </div>
                        <div className="flex justify-center gap-x-4">
                            <button
                                onClick={handleGoBack}
                                className="px-4 py-2 text-lg font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={handleTopUp}
                                className="px-4 py-2 text-lg font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Top up your wallet
                            </button>
                            <button
                                onClick={handleTransfer}
                                className="px-4 py-2 text-lg font-medium text-white bg-green-500 border border-transparent rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Transfer money
                            </button>
                        </div>
                    </div>
                )}
                <div className="mt-8 space-y-4">
                <div className="flex flex-col items-left">
                    <h2 className="text-2xl font-semibold mb-6">Transaction History</h2>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <input
                            type="month"
                            value={monthYear}
                            onChange={(e) => setMonthYear(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md"
                            style={{ fontFamily: 'sans-serif', fontVariant: 'normal' }}
                        />
                    </div>
                    </div>
                    <div className="overflow-y-auto max-h-96">
                        {filteredTransactions.length === 0 ? (
                            <p className="text-center text-gray-600">No transactions found</p>
                        ) : (
                            <table className="min-w-full bg-auto">
                                <thead className="sticky top-0 bg-white">
                                    <tr>
                                        <th className="px-4 py-2 border">Type Of Payment</th>
                                        <th className="px-4 py-2 border">Create Date</th>
                                        <th className="px-4 py-2 border">Transaction ID</th>
                                        <th className="px-4 py-2 border">Amount</th>
                                        <th className="px-4 py-2 border">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((transaction, index) => (
                                        <tr key={`${transaction.paymentTopUpId}_${transaction.createDate}_${index}`}>
                                            <td className="px-4 py-2 border">{transaction.typeOfPayment}</td>
                                            <td className="px-4 py-2 border">
                                                {new Date(transaction.createDate).toLocaleString('vi-VN')}
                                            </td>
                                            <td className="px-4 py-2 border">{transaction.transactionId}</td>
                                            <td className={`px-4 py-2 border ${transaction.typeOfPayment.includes('Receive') || transaction.typeOfPayment.includes('Top up') ? 'text-green-500' : 'text-red-500'}`}>
                                                {transaction.typeOfPayment.includes('Receive') || transaction.typeOfPayment.includes('Top up') ? '+' : '-'}{transaction.amount ? transaction.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'N/A'}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {transaction.status === 'Success' ? (
                                                    <span className="flex items-center text-green-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 mr-1"><path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-36.5 182.5 96.3-48.1c23.6-11.8 52-1.9 63.9 21.7 11.8 23.6 1.9 52-21.7 63.9l-192 96c-9.7 4.9-21 5.4-31.2 1.4s-18.1-11.7-21.5-21.6l-96-288C106.7 74 122.9 49.8 147.8 42.3s51.2 4.4 63.4 25.1l82.2 82.2 20.1-100.7c5.2-26 30.5-42.9 56.5-37.7z" fill="currentColor"/></svg>
                                                        Success
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-red-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="w-4 h-4 mr-1"><path d="M242.7 256l100.1-100.1c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L197.3 210.7 97.3 110.7c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L151.3 256 51.3 356c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L197.3 301.3 297.3 401.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L242.7 256z" fill="currentColor"/></svg>
                                                        Rejected
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                </div>
            </div>
    );
};

export default Wallet;
