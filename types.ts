export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  link?: string;
}

export interface Column {
  id: string;
  title: string;
  tickets: Ticket[];
}

export interface Project {
  id: number;
  ownerId: number;
  userIds: number[];
  name: string;
  background?: string;
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
