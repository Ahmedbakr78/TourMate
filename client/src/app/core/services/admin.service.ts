import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

export interface SystemStats {
  totalUsers: number;
  activeTrips: number;
  totalDrivers: number;
  totalGuides: number;
  totalVehicles: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private api: ApiService) {}

  getUsers(): Observable<{ status: string; data: User[] }> {
    return this.api.get('/admin/users');
  }

  blockUser(id: string): Observable<unknown> {
    return this.api.patch(`/admin/users/${id}/block`, {});
  }

  unblockUser(id: string): Observable<unknown> {
    return this.api.patch(`/admin/users/${id}/unblock`, {});
  }

  getStats(): Observable<{ status: string; data: SystemStats }> {
    return this.api.get('/admin/stats');
  }
}
