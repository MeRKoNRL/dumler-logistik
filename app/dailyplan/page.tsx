import { useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';

export 
'use client';

import toast from 'react-hot-toast';
import { OnlyPermission } from '@/components/Access';
import { AutocompleteInput } from '@/components/ui/Autocomplete';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

import { db } from '@/lib/firestore';

import { format } from 'date-fns';


<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const checkAndCopyPlan = async () => {
      const db = getFirestore(app);
      const today = new Date().toISOString().split('T')[0];
      const snap = await getDocs(collection(db, 'daily_plans'));
      const dates = snap.docs.map(doc => doc.data().date).filter(Boolean).sort().reverse();
      if (!dates.includes(today) && dates.length > 0) {
        const lastDate = dates.find(d => d < today);
        const lastDoc = snap.docs.find(doc => doc.data().date === lastDate);
        if (lastDoc) {
          const lastEntries = lastDoc.data().entries || [];
          const newEntries = lastEntries.map((e: PlanEntry) => ({ ...e, kunden1: '', kunden2: e.kunden2 || '', assignedTo: '' }));
          await addDoc(collection(db, 'daily_plans'), { date: today, entries: newEntries });
          location.reload();
        }
      }
    };
    checkAndCopyPlan();
    if (!loading && (!user || !['admin', 'dispatcher'].includes(user.role))) {
      router.push('/');
    }
  }, [user, loading]);

export default function DailyPlanPage() {
  
  const [autocompleteDrivers, setAutocompleteDrivers] = useState<string[]>([]);
  const [autocompleteTours, setAutocompleteTours] = useState<string[]>([]);
  const [autocompleteVehicles, setAutocompleteVehicles] = useState<string[]>([]);
  const [autocompleteRoutes, setAutocompleteRoutes] = useState<string[]>([]);

  useEffect(() => {
    const checkAndCopyPlan = async () => {
      const db = getFirestore(app);
      const today = new Date().toISOString().split('T')[0];
      const snap = await getDocs(collection(db, 'daily_plans'));
      const dates = snap.docs.map(doc => doc.data().date).filter(Boolean).sort().reverse();
      if (!dates.includes(today) && dates.length > 0) {
        const lastDate = dates.find(d => d < today);
        const lastDoc = snap.docs.find(doc => doc.data().date === lastDate);
        if (lastDoc) {
          const lastEntries = lastDoc.data().entries || [];
          const newEntries = lastEntries.map((e: PlanEntry) => ({ ...e, kunden1: '', kunden2: e.kunden2 || '', assignedTo: '' }));
          await addDoc(collection(db, 'daily_plans'), { date: today, entries: newEntries });
          location.reload();
        }
      }
    };
    checkAndCopyPlan();
    const db = getFirestore(app);
  const router = useRouter();
    Promise.all([
      getDoc(doc(db, 'meta', 'drivers')),
      getDoc(doc(db, 'meta', 'tours')),
      getDoc(doc(db, 'meta', 'vehicles')),
      getDoc(doc(db, 'meta', 'routes')),
    ]).then(([d1, d2, d3, d4]) => {
      setAutocompleteTours(d1.data()?.list || []);
      setAutocompleteDrivers(d1.data()?.list || []);
      setAutocompleteVehicles(d2.data()?.list || []);
      setAutocompleteRoutes(d3.data()?.list || []);
    });
  }, []);


const [extras, setExtras] = useState([{},{},{}]);
  const [abholkunden, setAbholkunden] = useState([{ name: '', driver: '' }]);

const [absences, setAbsences] = useState<PlanEntry[]>([]);
  const [pickupNotes, setPickupNotes] = useState('');

const [filterName, setFilterName] = useState('');
  const [filterAuto, setFilterAuto] = useState('');
  const [filterTour, setFilterTour] = useState('');

const [entries, setEntries] = useState<PlanEntry[]>([]);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    const checkAndCopyPlan = async () => {
      const db = getFirestore(app);
      const today = new Date().toISOString().split('T')[0];
      const snap = await getDocs(collection(db, 'daily_plans'));
      const dates = snap.docs.map(doc => doc.data().date).filter(Boolean).sort().reverse();
      if (!dates.includes(today) && dates.length > 0) {
        const lastDate = dates.find(d => d < today);
        const lastDoc = snap.docs.find(doc => doc.data().date === lastDate);
        if (lastDoc) {
          const lastEntries = lastDoc.data().entries || [];
          const newEntries = lastEntries.map((e: PlanEntry) => ({ ...e, kunden1: '', kunden2: e.kunden2 || '', assignedTo: '' }));
          await addDoc(collection(db, 'daily_plans'), { date: today, entries: newEntries });
          location.reload();
        }
      }
    };
    checkAndCopyPlan();
    fetchEntries();
  }, [date]);

  const fetchEntries = async () => {
    const q = query(collection(db, 'daily_plans'), where('date', '==', date));
    const snap = await getDocs(q);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (data.length > 0) {
      setEntries(data[0].entries || []);
    } else {
      setEntries([]);
    }
  };

  const handleAdd = () => {
    setEntries([...entries, { driver: '', vehicle: '', client: '', cargo: '', route: '', status: '' }]);
  };

  const handleUpdate = (index: number, field: string, value: string) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  
  const [copyDrivers, setCopyDrivers] = useState(true);
  const [copyVehicles, setCopyVehicles] = useState(true);
  const [copyClients, setCopyClients] = useState(true);

  const copyToNextDay = async () => {
    const today = new Date(date);
    const next = new Date(today);
    next.setDate(today.getDate() + 1);
    const nextDate = format(next, 'yyyy-MM-dd');

    const newEntries = entries.map(entry => ({
      driver: copyDrivers ? entry.driver : '',
      vehicle: copyVehicles ? entry.vehicle : '',
      client: copyClients ? entry.client : '',
      cargo: '',
      route: '',
      status: ''
    }));

    await addDoc(collection(db, 'daily_plans'), { date: nextDate, entries: newEntries });
    alert('Следующий день создан: ' + nextDate);
  };
    

const handleSave = async () => {
  toast.success('План успешно сохранён'); () => {
    const q = query(collection(db, 'daily_plans'), where('date', '==', date));
    const snap = await getDocs(q);
    if (snap.empty) {
      await addDoc(collection(db, 'daily_plans'), { date, entries });
    } else {
      const docId = snap.docs[0].id;
      await updateDoc(doc(db, 'daily_plans', docId), { entries });
    }
    alert('Сохранено');
  };

  return (
    <OnlyPermission permission="dailyplan"><main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-2">📅 Дневной план</h1>
      <p className="text-sm text-gray-500 mb-4">Редактируйте и сохраняйте маршруты, создавайте следующий день.</p>
      <a href="/dailyplan/list" className="text-blue-600 text-sm underline">← Назад к списку</a>
      <div className="mb-4 flex items-center gap-2">
        <label>Дата:</label><span className='text-xs text-gray-400 ml-2'>Выберите дату для редактирования</span>
        <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)}  />
        <div className='text-xs text-gray-500 mb-1'>Добавьте новую запись или создайте следующий день</div>
        <Button onClick={handleAdd} className="bg-green-600 text-white px-3 py-1 rounded text-sm">+ Запись</Button>
        <Button onClick={handleSave} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">💾 Сохранить</Button>
      
        <Button onClick={copyToNextDay} className="bg-gray-700 text-white px-3 py-1 rounded text-sm">📆 Создать следующий день</Button>
        <div className="flex gap-4 text-sm items-center">
          <label><input type="checkbox" checked={copyDrivers} onChange={() => setCopyDrivers(!copyDrivers)} /> Водителей</label>
          <label><input type="checkbox" checked={copyVehicles} onChange={() => setCopyVehicles(!copyVehicles)} /> Авто</label>
          <label><input type="checkbox" checked={copyClients} onChange={() => setCopyClients(!copyClients)} /> Клиентов</label>
        </div>
    
      </div>

      <ul className="space-y-2">
        {entries
    .filter(e => (!filterName || e.name?.toLowerCase().includes(filterName.toLowerCase()))
      && (!filterAuto || e.auto === filterAuto)
      && (!filterTour || e.tour === filterTour))
    .map((entry, index) => (
          <li key={index} className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {['driver', 'vehicle', 'client', 'cargo', 'route', 'status'].map((field) => (
              <TextInput
                key={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)} title={'Введите ' + field} title={field}
                
                value={entry[field] || ''}
                onChange={(e) => handleUpdate(index, field, e.target.value)}
              />
            ))}
          </li>
        ))}
      </ul>
    </main></OnlyPermission>
  );
}
