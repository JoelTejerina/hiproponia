export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  username: string;
  password: string;
  razonSocial: string;
  email?: string;
  role: UserRole;
  approved: boolean;
}
