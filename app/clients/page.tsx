'use client';


export default function ClientsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [example, setExample] = useState<string>('Загрузка...');

  useEffect(() => {
    // Здесь можно вставить логику запроса
    setExample('ClientsPage готов');
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">ClientsPage</h1>
      <p>ClientsPage страница работает.</p>
    </div>
  );
}