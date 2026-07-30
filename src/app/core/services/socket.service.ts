import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { Subject } from 'rxjs';
import { environment } from '../../../../../shared/src/environments/environment';
import { TokenStorageService } from '../../../../../shared/src/app/core/services/token-storage.service';

/**
 * Connects to the backend's Socket.IO server (now initialized server-side via
 * initSocket(server) in src/index.ts) to receive live "new-notification" events.
 */
@Injectable({ providedIn: 'root' })
export class SocketService {

  private socket: Socket | null = null;
  newNotification$ = new Subject<any>();

  constructor(private tokenStorage: TokenStorageService) { }

  connect(): void {
    const token = this.tokenStorage.getAccessToken();
    if (!token || this.socket?.connected) return;

    this.socket = io(environment.apiUrl, {
      auth: { token },
      transports: ['websocket']
    });

    this.socket.on('new-notification', (payload) => {
      this.newNotification$.next(payload);
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}
