import React, { useState } from 'react';
import DriverCard from '../components/DriverCard';
import ClientDistribution from '../components/ClientDistribution';
import ClientsChart from '../components/ClientsChart';
import ReportButtons from '../components/ReportButtons';
import Sidebar from '../components/Sidebar';

const driversMock = [
  { id: 1, name: 'Payam Anvari', tour: '4007', car: 'H-DL1025', info: '' },
  { id: 2, name: 'Romans Latvels', tour: '4006', car: 'H-DL1102E', info: '' },
  { id: 3, name: 'Yevhenii Nedaivoda', tour: '', car: '', info: 'Отпуск' }
];

const Dashboard = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='ml-64 p-4 w-full'>
  const [selectedTour, setSelectedTour] = useState(null);
  const [clients, setClients] = useState({ '4006': 50 });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Главная</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {driversMock.map(driver => (
          <DriverCard key={driver.id} driver={driver} onClick={() => {
            if (clients[driver.tour]) {
              setSelectedTour(driver.tour);
            }
          }} />
        ))}
      </div>

      {selectedTour && (
        <ClientDistribution
          tour={selectedTour}
          total={clients[selectedTour]}
          onClose={() => setSelectedTour(null)}
        />
      )}
    </div>
  );
};

      <ReportButtons />
    </div>
  );
};

      <ClientsChart />
      <ReportButtons />
    </div>
  );
};

      </div>
    </div>
  );
};

export default Dashboard;
