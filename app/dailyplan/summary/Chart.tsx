'use client';


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  data: Record<string, number>;
  title: string;
}

export default function SummaryChart({ data, title }: Props) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  return (
    <div className="my-6 bg-white border rounded p-4 shadow-sm">
      <h2 className="text-sm font-semibold mb-2">{title}</h2>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: title,
              data: values,
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderRadius: 4
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
          },
        }}
      />
    </div>
  );
}