'use client';
import { useEffect } from 'react';

const DriverReport = () => {
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch('/api/report', { method: 'GET' });
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReport();
  }, []);

  return (
    <div>Driver Report</div>
  );
};

export default DriverReport;
