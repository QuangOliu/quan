import React, { useEffect, useState } from 'react';

const BatDen = () => {
  const [ledData, setLedData] = useState([]);

  const fetchData = () => {
    fetch('http://localhost:5000/history')
      .then(response => response.json())
      .then(data => {
        const ledCounts = data.historyData.reduce((acc, entry) => {
          acc[entry.led_id] = (acc[entry.led_id] || 0) + entry.state;
          return acc;
        }, {});

        setLedData(ledCounts);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []); 

  return (
    <div className="batden">
      {Object.keys(ledData).map(ledId => (
        <p key={ledId}>
          Đèn {ledId} được bật {ledData[ledId]} lần
        </p>
      ))}
    </div>
  );
};

export default BatDen;
