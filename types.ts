export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Column {
  id: string;
  title: string;
  tickets: Ticket[];
}

export interface Project {
  id: number;
  userId: number;
  name: string;
  columns: Column[];
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  color: string;
}

export interface AppData {
  users: User[];
  projects: Project[];
}
