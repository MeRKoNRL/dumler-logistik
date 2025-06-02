import React from 'react';

const ReportButtons = () => {
  const reports = [
    { name: 'Клиенты (сегодня)', path: '/report/clients' },
    { name: 'Отпуска и отгулы', path: '/report/vacations' },
    { name: 'Заявки от водителей', path: '/report/requests' },
    { name: 'Автомобили', path: '/report/vehicles' }
  ];

  const downloadReport = (path) => {
    window.open('http://localhost:3001' + path, '_blank');
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow mt-4">
      <h2 className="text-lg font-bold mb-2"> Отчёты (PDF)</h2>
      <div className="flex flex-col gap-2">
        {reports.map((r, i) => (
          <button
            key={i}
            onClick={() => downloadReport(r.path)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {r.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReportButtons;
