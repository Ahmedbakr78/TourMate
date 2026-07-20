import { Injectable } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  toasts: Toast[] = [];

  success(message: string) { this.add(message, 'success'); }
  error(message: string) { this.add(message, 'error'); }
  info(message: string) { this.add(message, 'info'); }

  private add(message: string, type: Toast['type']) {
    const id = ++this.counter;
    this.toasts.push({ id, message, type });
    setTimeout(() => this.remove(id), 4000);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
