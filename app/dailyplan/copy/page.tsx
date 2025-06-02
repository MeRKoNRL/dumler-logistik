'use client';


export default function DailyPlanCopy() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [example, setExample] = useState<string>('Загрузка...');

  useEffect(() => {
    // Здесь можно вставить логику запроса
    setExample('DailyPlanCopy готов');
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">DailyPlanCopy</h1>
      <p>DailyPlanCopy страница работает.</p>
    </div>
  );
}