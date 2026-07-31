import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../shared/src/environments/environment';
import { ISuccessResponse } from '../models/response.model';
import { RoleEnum, StatusUserEnum, TripStatusEnum, VerificationStatusEnum } from '../models/enums';
import { IUser } from '../../../../../shared/src/app/core/models/user.model';
import { IDriver } from '../models/driver.model';
import { IGuide } from '../models/guide.model';
import { ITrip } from '../models/trip.model';

export interface IDashboardStats {
  totalUsers: number;
  totalTrips: number;
  totalPlaces: number;
  totalReviews: number;
  totalVotes: number;
  totalGuides: number;
  totalDrivers: number;
  totalLostItems: number;
}

export interface ISystemStatistics {
  users: { total: number; active: number; blocked: number };
  trips: { total: number; active: number; completed: number; cancelled: number };
  lostItems: { total: number; pending: number; resolved: number };
}

@Injectable({ providedIn: 'root' })
export class AdminService {

  private readonly baseUrl = `${environment.apiUrl}/admin`;
 
  constructor(private http: HttpClient) { }

  getDashboard(): Observable<ISuccessResponse<IDashboardStats>> {
    return this.http.get<ISuccessResponse<IDashboardStats>>(`${this.baseUrl}/dashboard`);
  }

  getSystemStatistics(): Observable<ISuccessResponse<ISystemStatistics>> {
    return this.http.get<ISuccessResponse<ISystemStatistics>>(`${this.baseUrl}/system-statistics`);
  }

  changeUserRole(id: string, role: RoleEnum): Observable<ISuccessResponse<IUser>> {
    return this.http.patch<ISuccessResponse<IUser>>(`${this.baseUrl}/${id}/role`, { role });
  }

  changeUserStatus(id: string, status: StatusUserEnum): Observable<ISuccessResponse<IUser>> {
    return this.http.patch<ISuccessResponse<IUser>>(`${this.baseUrl}/${id}/status`, { status });
  }

  deleteUser(id: string): Observable<ISuccessResponse> {
    return this.http.delete<ISuccessResponse>(`${this.baseUrl}/${id}/delete`);
  }

  updateDriverVerificationStatus(id: string, verificationStatus: VerificationStatusEnum.APPROVED | VerificationStatusEnum.REJECTED): Observable<ISuccessResponse<IDriver>> {
    return this.http.patch<ISuccessResponse<IDriver>>(`${this.baseUrl}/driver/${id}/verification-status`, { verificationStatus });
  }

  updateGuideVerificationStatus(id: string, verificationStatus: VerificationStatusEnum.APPROVED | VerificationStatusEnum.REJECTED): Observable<ISuccessResponse<IGuide>> {
    return this.http.patch<ISuccessResponse<IGuide>>(`${this.baseUrl}/guide/${id}/verification-status`, { verificationStatus });
  }

  assignTripResources(id: string, payload: { guideId?: string; driverId?: string; vehicleId?: string }): Observable<ISuccessResponse<ITrip>> {
    return this.http.patch<ISuccessResponse<ITrip>>(`${this.baseUrl}/trip/${id}/assign-resources`, payload);
  }

  updateTripStatus(id: string, status: TripStatusEnum): Observable<ISuccessResponse<ITrip>> {
    return this.http.patch<ISuccessResponse<ITrip>>(`${this.baseUrl}/trip/${id}/status`, { status });
  }

  confirmTripPayment(id: string, isPaid: boolean): Observable<ISuccessResponse<ITrip>> {
    return this.http.patch<ISuccessResponse<ITrip>>(`${this.baseUrl}/trip/${id}/confirm-payment`, { isPaid });
  }
}
