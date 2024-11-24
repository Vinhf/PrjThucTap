// Price.js
import React, { useState, useEffect } from 'react';


interface PriceProps {
    onComplete: () => void; // Notify the parent component (CreateCourseForm) that the step is complete
  }
const Price: React.FC<PriceProps> = ({ onComplete }) => {
  const [price, setPrice] = useState<string>(() => {
    const courseData = JSON.parse(sessionStorage.getItem('courseData') || '{}');
    return courseData.price !== undefined ? String(courseData.price) : '';
  });
  const [coupon, setCoupon] = useState<string>(() => {
    const courseData = JSON.parse(sessionStorage.getItem('courseData') || '{}');
    return courseData.coupon !== undefined ? String(courseData.coupon) : '';
  });
  const [couponOutput, setCouponOutput] = useState<number | undefined>(() => {
    const courseData = JSON.parse(sessionStorage.getItem('courseData') || '{}');
    return courseData.couponOutput !== undefined ? courseData.couponOutput : undefined;
  });
  const [error, setError] = useState<string | undefined>();
  const [couponError, setCouponError] = useState<string | undefined>();

  // Save valid price to session storage
  useEffect(() => {
    const numericPrice = parseFloat(price);
    if (!isNaN(numericPrice) && numericPrice >= 100000) {
      try {
        const courseData = JSON.parse(sessionStorage.getItem('courseData') || '{}');
        courseData.price = numericPrice;
        sessionStorage.setItem('courseData', JSON.stringify(courseData));
        setError(undefined);
           
      } catch (e) {
        console.error('Error parsing courseData:', e);
      }
    } else {
      setError('Price must be at least 100,000 VND');
    }
  }, [price]);

  // Save valid coupon to session storage
  useEffect(() => {
    const numericCoupon = parseFloat(coupon);
    if (!isNaN(numericCoupon) && numericCoupon <= 100) {
      try {
        const courseData = JSON.parse(sessionStorage.getItem('courseData') || '{}');
        courseData.coupon = numericCoupon;
        if (!isNaN(parseFloat(price)) && parseFloat(price) >= 100000) {
          const discount = parseFloat(price) - (numericCoupon / 100) * parseFloat(price);
          setCouponOutput(discount);
          courseData.couponOutput = discount;
        }
        sessionStorage.setItem('courseData', JSON.stringify(courseData));
        setCouponError(undefined);
        onComplete(); 
      } catch (e) {
        console.error('Error parsing courseData:', e);
      }
    } else if (!isNaN(numericCoupon) && numericCoupon > 100) {
      setCouponError('Coupon cannot be more than 100%');
    }
  }, [coupon, price, onComplete]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoupon(e.target.value);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  
  return (
    <div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center">
          <h3 className="font-medium text-black dark:text-white ml-2">
            Price
          </h3>
        </div>
        <div className="flex flex-col gap-5.5 p-6.5">
          <div>
            <label className="mb-3 block text-black dark:text-white">
              Price
            </label>
            <input
              type="text"
              placeholder="Enter course price"
              value={price}
              onChange={handlePriceChange}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <div>
            <label className="mb-3 block text-black dark:text-white">
              Coupon (%)
            </label>
            <input
              type="text"
              placeholder="Enter coupon percentage"
              value={coupon}
              onChange={handleCouponChange}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
            {couponError && <p className="text-red-500">{couponError}</p>}
            {couponOutput !== undefined && (
              <p className="mt-2 text-green-500">Discounted price: {formatCurrency(couponOutput)} VND</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Price;
