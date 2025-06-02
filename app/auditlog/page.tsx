'use client';


export default function AuditLog() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [example, setExample] = useState<string>('Загрузка...');

  useEffect(() => {
    // Здесь можно вставить логику запроса
    setExample('AuditLog готов');
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">AuditLog</h1>
      <p>AuditLog страница работает.</p>
    </div>
  );
}