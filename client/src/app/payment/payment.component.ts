import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService, PaymentResult } from '../core/services/payment.service';
import { TranslationService } from '../core/services/translation.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="payment-overlay" (click)="cancel.emit()">
      <div class="payment-modal" (click)="\$event.stopPropagation()">
        @if (state() === 'form') {
          <div class="payment-form">
            <div class="payment-header">
              <h3>{{ translation.t('payment.complete') }}</h3>
              <p class="muted">{{ translation.t('payment.secure_sim') }}</p>
            </div>
            <div class="amount-display">
              <span class="amount-label">{{ translation.t('ui.total') }}</span>
              <span class="amount-value">\${{ amount() }}</span>
            </div>
            <div class="card-preview">
              <div class="card-chip"></div>
              <div class="card-number">
                <input class="card-input" [(ngModel)]="cardNumber" placeholder="4242 4242 4242 4242" maxlength="19" />
              </div>
              <div class="card-row">
                <input class="card-input sm" [(ngModel)]="expiry" placeholder="MM/YY" maxlength="5" />
                <input class="card-input sm" [(ngModel)]="cvv" placeholder="CVV" maxlength="4" />
              </div>
              <div class="card-name">
                <input class="card-input" [(ngModel)]="cardName" placeholder="Cardholder Name" />
              </div>
            </div>
            <div class="payment-actions">
              <button class="tm-btn pay-btn" (click)="pay()" [disabled]="processing()">
                @if (processing()) {
                  <span class="btn-spinner"></span> {{ translation.t('payment.processing') }}
                } @else {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
                  {{ translation.t('payment.pay') }} \${{ amount() }}
                }
              </button>
              <button class="tm-btn tm-btn-outline" (click)="cancel.emit()" [disabled]="processing()">{{ translation.t('ui.cancel') }}</button>
            </div>
          </div>
        }
        @if (state() === 'processing') {
          <div class="payment-processing">
            <div class="processing-spinner"></div>
            <h3>{{ translation.t('payment.processing_payment') }}</h3>
            <p class="muted">{{ translation.t('payment.please_wait') }}</p>
          </div>
        }
        @if (state() === 'result') {
          <div class="payment-result" [class.success]="result()?.success" [class.failed]="!result()?.success">
            @if (result()?.success) {
              <div class="result-icon success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="16 8 10 16 7 13"/></svg>
              </div>
              <h3>{{ translation.t('payment.successful') }}</h3>
              <p class="txn-id">{{ translation.t('payment.txn_id') }} {{ result()?.transactionId }}</p>
              <p class="txn-amount">\${{ result()?.amount }}</p>
              <div class="result-actions">
                <button class="tm-btn tm-btn-success" (click)="confirmSuccess()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ translation.t('ui.confirm') }}
                </button>
                <button class="tm-btn tm-btn-outline" (click)="cancel.emit()">{{ translation.t('ui.close') }}</button>
              </div>
            } @else {
              <div class="result-icon failed-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              </div>
              <h3>{{ translation.t('payment.failed') }}</h3>
              <p class="muted">{{ result()?.message }}</p>
              <div class="result-actions">
                <button class="tm-btn" (click)="retry()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                  {{ translation.t('payment.try_again') }}
                </button>
                <button class="tm-btn tm-btn-outline" (click)="cancel.emit()">{{ translation.t('ui.cancel') }}</button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .payment-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center; z-index: 9999;
    }
    .payment-modal {
      background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 16px;
      padding: 1.5rem; width: 100%; max-width: 420px; box-shadow: 0 24px 80px rgba(0,0,0,0.5);
      animation: modalIn 0.25s ease;
    }
    @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .payment-header { margin-bottom: 1rem; }
    .payment-header h3 { margin: 0; font-size: 1.1rem; }
    .amount-display { text-align: center; margin-bottom: 1.25rem; }
    .amount-label { display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--tm-muted); }
    .amount-value { font-size: 2rem; font-weight: 800; color: var(--tm-text); }

    .card-preview {
      background: linear-gradient(135deg, #111111, #2a2a2a); border-radius: 12px;
      padding: 1.25rem; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.75rem;
    }
    .card-chip { width: 32px; height: 24px; background: linear-gradient(135deg, #9a7b3a, #9a7b3a); border-radius: 4px; }
    .card-input {
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px;
      padding: 0.5rem 0.65rem; color: #fff; font-size: 0.9rem; width: 100%; font-family: 'Courier New', monospace;
      transition: border-color 0.2s;
    }
    .card-input:focus { outline: none; border-color: var(--tm-primary); }
    .card-input::placeholder { color: rgba(255,255,255,0.3); }
    .card-row { display: flex; gap: 0.5rem; }
    .card-input.sm { width: 100px; }
    .card-name .card-input { font-family: inherit; }

    .payment-actions { display: flex; gap: 0.5rem; }
    .pay-btn, .payment-actions .tm-btn { flex: 1; justify-content: center; }

    .payment-processing { text-align: center; padding: 2rem; }
    .processing-spinner { width: 40px; height: 40px; border: 3px solid var(--glass-border); border-top-color: var(--tm-primary); border-radius: 50%; margin: 0 auto 1rem; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .payment-processing h3 { margin: 0 0 0.3rem; }
    .btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; display: inline-block; animation: spin 0.6s linear infinite; }

    .payment-result { text-align: center; padding: 1.5rem; }
    .result-icon { margin-bottom: 0.75rem; }
    .success-icon svg { color: #3f7a52; }
    .failed-icon svg { color: #a33a32; }
    .payment-result h3 { margin: 0 0 0.3rem; }
    .txn-id { font-size: 0.78rem; color: var(--tm-muted); margin: 0 0 0.75rem; font-family: monospace; }
    .txn-amount { font-size: 2rem; font-weight: 800; color: var(--tm-success); margin: 0 0 1rem; }
    .result-actions { display: flex; gap: 0.5rem; justify-content: center; }
  `]
})
export class PaymentComponent {
  private paymentService = inject(PaymentService);
  translation = inject(TranslationService);
  private toast = inject(ToastService);
  amount = input<number>(0);
  confirm = output<PaymentResult>();
  cancel = output<void>();

  state = signal<'form' | 'processing' | 'result'>('form');
  processing = signal(false);
  result = signal<PaymentResult | null>(null);

  cardNumber = '';
  expiry = '';
  cvv = '';
  cardName = '';

  pay() {
    this.state.set('processing');
    this.processing.set(true);
    this.paymentService.processPayment(this.amount()).subscribe({
      next: (res) => {
        this.processing.set(false);
        this.result.set(res);
        this.state.set('result');
      },
      error: () => {
        this.processing.set(false);
        this.toast.error('Payment service unavailable');
        this.state.set('form');
      },
    });
  }

  retry() {
    this.state.set('form');
    this.result.set(null);
  }

  confirmSuccess() {
    const r = this.result();
    if (r) this.confirm.emit(r);
  }
}
