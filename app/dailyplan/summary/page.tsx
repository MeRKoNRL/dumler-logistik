'use client';


export default function DailySummary() {
  useEffect(() => {
    const download = async () => {
      const res = await fetch('/api/export');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'summary.xlsx';
      link.click();
    };
    download();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">Экспорт сводки</h1>
      <p>Файл будет автоматически загружен...</p>
    </main>
  );
}