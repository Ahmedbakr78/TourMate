import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  status: 'completed' | 'failed';
  message: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private txCounter = 0;

  processPayment(amount: number): Observable<PaymentResult> {
    const success = Math.random() > 0.15;
    this.txCounter++;
    const result: PaymentResult = {
      success,
      transactionId: success ? `TXN-${Date.now()}-${this.txCounter}` : '',
      amount,
      status: success ? 'completed' : 'failed',
      message: success
        ? 'Payment processed successfully'
        : 'Transaction declined. Please try again.',
      timestamp: new Date().toISOString(),
    };
    return of(result).pipe(delay(1200));
  }

  getStoredTransactions(): PaymentResult[] {
    try {
      return JSON.parse(localStorage.getItem('tm_payments') || '[]');
    } catch { return []; }
  }

  private saveTransaction(tx: PaymentResult) {
    const list = this.getStoredTransactions();
    list.unshift(tx);
    localStorage.setItem('tm_payments', JSON.stringify(list.slice(0, 50)));
  }
}
