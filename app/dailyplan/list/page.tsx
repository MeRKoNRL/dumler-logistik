'use client';


export default function DailyPlanList() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [example, setExample] = useState<string>('Загрузка...');

  useEffect(() => {
    // Здесь можно вставить логику запроса
    setExample('DailyPlanList готов');
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">DailyPlanList</h1>
      <p>DailyPlanList страница работает.</p>
    </div>
  );
}