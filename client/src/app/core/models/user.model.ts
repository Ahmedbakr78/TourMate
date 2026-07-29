export type Role = 'admin' | 'tourist' | 'driver' | 'guide';

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  status: string;
  profileImage?: { secure_url?: string; public_id?: string };
}

export interface AuthResponse {
  token: string;
  user: User;
}
