'use client';


  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && (!user || !['admin', 'dispatcher'].includes(user.role))) {
      router.push('/');
    }
  }, [user, loading]);

export default function ImportPage() {
  const [data, setData] = useState<any[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: 'binary' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
      setData(rows);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <OnlyPermission permission="import"><main className="max-w-screen-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Импорт из Excel</h1>
      <input type="file" accept=".xlsx" onChange={handleFile} className="mb-4" />
      {data.length > 0 && (
        <div className="responsive-table">
<table className="table-auto border w-full text-sm">
          <thead className="bg-gray-100">
            <tr>{Object.keys(data[0]).map((key, i) => <th key={i} className="border px-2 py-1">{key}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j} className="border px-2 py-1">{val as string}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
</div>
      )}
    </main></OnlyPermission>
  );
}