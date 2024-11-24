import React, { useState, useEffect } from 'react';
import { UserGetAll, setAccessToken } from '../../../services/UserGetAll';

const CRUDUser = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAccessToken();
    const fetchData = async () => {
      try {
        const apiData = await UserGetAll();
        setData(apiData);
        setLoading(false);
      } catch (error) {
        setError(error.message);  
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Data from API:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default CRUDUser;
