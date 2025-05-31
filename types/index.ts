export interface PlanEntry {
  name: string;
  tour: string;
  auto: string;
  kunden1: string;
  info?: string;
  assignedTo?: string;
}

export interface DailyPlan {
  date: string;
  entries: PlanEntry[];
}

export interface Client {
  id: string;
  name: string;
  address: string;
  phone?: string;
  assignedTo?: string;
}

export interface Vehicle {
  id: string;
  number: string;
  driver?: string;
}

export interface Absence {
  userId: string;
  type: 'отпуск' | 'больничный' | 'отгул';
  startDate: string;
  endDate: string;
}

export interface LogEntry {
  action: string;
  userId: string;
  email: string;
  details?: any;
  createdAt?: any;
}
