import React from 'react';

const DriverCard = ({ driver, onClick }) => {
  return (
    <div
      className="border rounded-xl p-4 bg-white shadow cursor-pointer hover:bg-blue-50"
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold">{driver.name}</h3>
      <p>Тур: {driver.tour || '-'}</p>
      <p>Авто: {driver.car || '-'}</p>
      <p className="text-sm text-gray-600">{driver.info || 'В работе'}</p>
    </div>
  );
};

export default DriverCard;
