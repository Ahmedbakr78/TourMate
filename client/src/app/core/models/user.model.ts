export type Role = 'admin' | 'tourist' | 'driver' | 'guide';

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
