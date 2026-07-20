import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteService } from '../../core/services/vote.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-vote-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vote-group">
      @if (loading) {
        <span class="loading">...</span>
      } @else {
        <button class="vote-btn up" [class.active]="userVote === 'UP'" (click)="vote('UP')" [disabled]="voting">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
          {{ upvotes }}
        </button>
        <button class="vote-btn down" [class.active]="userVote === 'DOWN'" (click)="vote('DOWN')" [disabled]="voting">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          {{ downvotes }}
        </button>
      }
    </div>
  `,
  styles: [`
    .vote-group { display: flex; gap: 0.5rem; align-items: center; }
    .vote-btn { padding: 0.3rem 0.8rem; border: 1px solid var(--glass-border); border-radius: 6px; cursor: pointer; background: var(--tm-surface); color: var(--tm-text); font-size: 0.85rem; transition: all .15s; display: flex; align-items: center; gap: 0.3rem; }
    .vote-btn:disabled { opacity: 0.5; cursor: default; }
    .vote-btn.active.up { background: rgba(34,197,94,0.15); border-color: #3f7a52; color: #3f7a52; }
    .vote-btn.active.down { background: rgba(239,68,68,0.15); border-color: #a33a32; color: #a33a32; }
    .loading { color: var(--tm-muted); font-size: 0.85rem; }
  `]
})
export class VoteButtonComponent implements OnInit {
  private voteService = inject(VoteService);
  private toast = inject(ToastService);
  @Input() tripId = '';
  @Input() placeId!: string;
  upvotes = 0;
  downvotes = 0;
  userVote: string | null = null;
  loading = true;
  voting = false;

  ngOnInit() {
    this.voteService.getPlaceVotes(this.placeId).subscribe({
      next: (res) => { this.upvotes = res.data.summary.up; this.downvotes = res.data.summary.down; this.loading = false; },
      error: () => { this.loading = false; },
    });
    this.voteService.getUserVotes().subscribe({
      next: (res) => {
        const v = (res.data || []).find((v: any) => v.placeId?._id === this.placeId || v.placeId === this.placeId);
        if (v) this.userVote = v.voteValue;
      },
    });
  }

  vote(value: string) {
    if (this.userVote === value || this.voting) return;
    this.voting = true;
    this.voteService.create({ tripId: this.tripId, placeId: this.placeId, voteValue: value }).subscribe({
      next: () => { this.userVote = value; this.voting = false; this.ngOnInit(); },
      error: (e) => { this.voting = false; this.toast.error(e.error?.message || 'Vote failed'); },
    });
  }
}
