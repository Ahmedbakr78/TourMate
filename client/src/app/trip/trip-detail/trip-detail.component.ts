import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TripService, Trip } from '../../core/services/trip.service';
import { ReviewService } from '../../core/services/review.service';
import { TranslationService } from '../../core/services/translation.service';
import { ToastService } from '../../core/services/toast.service';
import { ReviewFormComponent } from '../../review/review-form/review-form.component';
import { LocalService, JournalEntry, TripPhoto } from '../../core/services/local.service';
import { ModalComponent } from '../../shared/modal.component';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReviewFormComponent, ModalComponent],
  template: `
    <div class="page">
      <a routerLink="/app/trip/list" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        {{ translation.t('ui.back') }}
      </a>

      @if (loading) {
        <div class="tm-loader"></div>
      } @else if (error) {
        <div class="error-box">{{ error }}</div>
      } @else if (trip) {
        <div class="detail-header">
          <div>
            <span class="badge badge-{{ trip.status.toLowerCase() }}">{{ translation.t('ui.' + trip.status.toLowerCase()) }}</span>
            <h2>{{ translation.t('trip.trip_details') }}</h2>
          </div>
          <div class="trip-price-large">\${{ trip.price }}</div>
        </div>

        <div class="detail-grid">
          <div class="info-section">
            <div class="info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <div><span class="info-label">Start</span><span class="info-value">{{ trip.startDate | date:'medium' }}</span></div>
            </div>
            <div class="info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <div><span class="info-label">End</span><span class="info-value">{{ trip.endDate | date:'medium' }}</span></div>
            </div>
            <div class="info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              <div><span class="info-label">People</span><span class="info-value">{{ trip.peopleCount }}</span></div>
            </div>
            <div class="info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <div><span class="info-label">{{ translation.t('ui.distance') }}</span><span class="info-value">{{ trip.distanceMeters ? (trip.distanceMeters / 1000).toFixed(1) + ' km' : 'N/A' }}</span></div>
            </div>
            <div class="info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div><span class="info-label">{{ translation.t('ui.places') }}</span><span class="info-value">{{ trip.places.length || 0 }}</span></div>
            </div>
          </div>

          <div class="actions-section">
            <h3>Actions</h3>
            <div class="action-btns">
              @if (trip.status === 'DRAFT') {
                <button class="tm-btn tm-btn-success" (click)="startTrip()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> {{ translation.t('ui.startTrip') }}
                </button>
                <button class="tm-btn tm-btn-danger" (click)="cancelTrip()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> {{ translation.t('ui.cancel') }}
                </button>
              }
              @if (trip.status === 'ONGOING') {
                <button class="tm-btn tm-btn-success" (click)="completeTrip()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> {{ translation.t('ui.completeTrip') }}
                </button>
              }
              @if (trip.status !== 'CANCELLED' && trip.status !== 'COMPLETED') {
                <button class="tm-btn tm-btn-outline" (click)="toggleShare()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  {{ trip.isShared ? 'Unshare' : translation.t('ui.share') }}
                </button>
                <button class="tm-btn tm-btn-outline" (click)="duplicateTrip()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> {{ translation.t('ui.duplicate') }}
                </button>
              }
              @if (trip.status === 'COMPLETED') {
                <button class="tm-btn tm-btn-outline" (click)="duplicateTrip()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> {{ translation.t('ui.duplicate') }}
                </button>
                <button class="tm-btn tm-btn-danger" (click)="deleteTrip()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> {{ translation.t('ui.delete') }}
                </button>
              }
              <button class="tm-btn tm-btn-outline" (click)="exportTrip()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {{ translation.t('trip.export') }}
              </button>
            </div>
            <div class="share-link-section">
                <label class="share-label">{{ translation.t('ui.share') }}</label>
              <div class="share-input-wrap">
                <input class="tm-input share-input" [value]="shareLink" readonly (click)="selectAndCopy($event)" />
                <button class="copy-btn" (click)="copyShareLink()" title="Copy link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>
            </div>
            @if (trip.isShared) {
              <div class="shared-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                This trip is shared
              </div>
            }
          </div>
        </div>

        <div class="trip-tabs">
          <button class="tab-btn" [class.active]="tripTab === 'overview'" (click)="tripTab = 'overview'">Overview</button>
          <button class="tab-btn" [class.active]="tripTab === 'notes'" (click)="tripTab = 'notes'">Notes</button>
          <button class="tab-btn" [class.active]="tripTab === 'checklist'" (click)="tripTab = 'checklist'">Checklist</button>
          <button class="tab-btn" [class.active]="tripTab === 'expenses'" (click)="tripTab = 'expenses'">Expenses</button>
          <button class="tab-btn" [class.active]="tripTab === 'weather'" (click)="tripTab = 'weather'">Weather</button>
          <button class="tab-btn" [class.active]="tripTab === 'journal'" (click)="tripTab = 'journal'">Journal</button>
          <button class="tab-btn" [class.active]="tripTab === 'memories'" (click)="tripTab = 'memories'">Memories</button>
          <button class="tab-btn" [class.active]="tripTab === 'share'" (click)="tripTab = 'share'">Share</button>
        </div>

        <div class="tab-content">
          @if (tripTab === 'overview') {
            <div class="overview-tab">
              <div class="places-section">
                <h3>{{ translation.t('ui.places') }} ({{ trip.places.length }})</h3>
                <div class="places-list">
                  @for (p of trip.places; track $index) {
                    <div class="place-item">
                      <span class="place-idx">{{ $index + 1 }}</span>
                      <div class="place-info">
                        <strong>{{ getPlaceName(p, $index) }}</strong>
                        <span class="muted">{{ getPlaceCity(p) }}{{ getPlaceCategory(p) }}</span>
                      </div>
                    </div>
                  } @empty {
                    <p class="muted">No places added yet</p>
                  }
                </div>
              </div>
              <div class="timeline-section">
                <h3>Trip Timeline</h3>
                <div class="timeline">
                  <div class="tl-item">
                    <div class="tl-dot green"></div>
                    <div><strong>Start</strong><span class="muted">{{ trip.startDate | date:'medium' }}</span></div>
                  </div>
                  <div class="tl-item">
                    <div class="tl-dot" [class.blue]="trip.status !== 'DRAFT'"></div>
                    <div><strong>End</strong><span class="muted">{{ trip.endDate | date:'medium' }}</span></div>
                  </div>
                  @if (trip.status === 'COMPLETED') {
                    <div class="tl-item">
                      <div class="tl-dot green"></div>
                      <div><strong>Completed</strong><span class="muted">{{ trip.endDate | date:'medium' }}</span></div>
                    </div>
                  }
                </div>
              </div>
              @if (reviews.length > 0) {
                <div class="reviews-section">
                  <h3>{{ translation.t('ui.review') }} ({{ reviews.length }})</h3>
                  @for (rev of reviews; track rev._id) {
                    <div class="review-item">
                      <div class="review-stars">
                        @for (s of [1,2,3,4,5]; track s) {
                          <svg width="14" height="14" viewBox="0 0 24 24" [attr.fill]="s <= rev.rating ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        }
                      </div>
                      <p class="review-comment">{{ rev.comment }}</p>
                    </div>
                  }
                </div>
              }
              @if (trip.status === 'COMPLETED') {
                <app-review-form [tripId]="trip._id!" />
              }
            </div>
          }
          @if (tripTab === 'notes') {
            <div class="notes-tab">
              <div class="notes-header">
                <h3>Trip Notes</h3>
                <button class="tm-btn tm-btn-sm" (click)="addNote()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Note
                </button>
              </div>
              @if (editingNote !== -1) {
                <div class="note-editor">
                  <input class="tm-input" [(ngModel)]="noteTitle" placeholder="Note title" />
                  <textarea class="tm-input" [(ngModel)]="noteText" rows="3" placeholder="Write your note..."></textarea>
                  <div class="note-actions">
                    <button class="tm-btn tm-btn-sm tm-btn-success" (click)="saveNote()">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      {{ editingNote === -2 ? 'Add' : 'Update' }}
                    </button>
                    <button class="tm-btn tm-btn-sm tm-btn-outline" (click)="cancelNote()">Cancel</button>
                  </div>
                </div>
              }
              @if (notes.length === 0 && editingNote === -1) {
                <div class="empty-tab">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  <p>No notes yet. Add notes about your trip.</p>
                </div>
              }
              <div class="notes-list">
                @for (note of notes; track $index) {
                  <div class="note-card">
                    <div class="note-card-top">
                      <strong>{{ note.title || 'Note ' + ($index + 1) }}</strong>
                      <div class="note-card-actions">
                        <button class="icon-btn-sm" (click)="editNote($index)" title="Edit">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="icon-btn-sm danger" (click)="deleteNote($index)" title="Delete">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </div>
                    <p>{{ note.text }}</p>
                  </div>
                }
              </div>
            </div>
          }
          @if (tripTab === 'checklist') {
            <div class="checklist-tab">
              <div class="checklist-header">
                <h3>Packing Checklist</h3>
                <div style="display:flex;gap:0.4rem">
                  <button class="tm-btn tm-btn-sm" (click)="addChecklistItem()">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Item
                  </button>
                  <button class="tm-btn tm-btn-sm tm-btn-outline" (click)="showTemplates = !showTemplates">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    Templates
                  </button>
                </div>
              </div>
              @if (showTemplates) {
                <div class="template-picker">
                  <strong>Load Packing Template</strong>
                  <div class="template-list">
                    @for (tpl of packingTemplates; track $index) {
                      <button class="template-btn" (click)="loadTemplate(tpl.items)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                        {{ tpl.name }}
                      </button>
                    }
                  </div>
                  <button class="tm-btn tm-btn-sm tm-btn-outline" (click)="showTemplates = false">Close</button>
                </div>
              }
              @if (showNewChecklistItem) {
                <div class="new-checklist-item">
                  <input class="tm-input" [(ngModel)]="newChecklistText" placeholder="Item name..." (keydown.enter)="saveChecklistItem()" />
                  <div class="note-actions">
                    <button class="tm-btn tm-btn-sm tm-btn-success" (click)="saveChecklistItem()">Add</button>
                    <button class="tm-btn tm-btn-sm tm-btn-outline" (click)="showNewChecklistItem = false; newChecklistText = ''">Cancel</button>
                  </div>
                </div>
              }
              <div class="checklist-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="checklistProgress"></div>
                </div>
                <span class="progress-text">{{ checkedItems }}/{{ checklistItems.length }} packed</span>
              </div>
              @if (checklistItems.length === 0 && !showNewChecklistItem) {
                <div class="empty-tab">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  <p>Create a packing checklist for your trip</p>
                </div>
              }
              <div class="checklist-items">
                @for (item of checklistItems; track $index) {
                  <div class="checklist-item" [class.done]="item.done">
                    <label class="check-label">
                      <input type="checkbox" [checked]="item.done" (change)="toggleChecklistItem($index)" />
                      <span class="check-box">
                        @if (item.done) {
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                        }
                      </span>
                      <span class="check-text">{{ item.text }}</span>
                    </label>
                    <button class="icon-btn-sm danger" (click)="deleteChecklistItem($index)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                }
              </div>
            </div>
          }
          @if (tripTab === 'expenses') {
            <div class="expenses-tab">
              <div class="expenses-header">
                <h3>Trip Expenses</h3>
                <button class="tm-btn tm-btn-sm" (click)="addExpense()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Expense
                </button>
              </div>
              @if (showNewExpense) {
                <div class="new-expense">
                  <input class="tm-input" [(ngModel)]="newExpenseTitle" placeholder="Expense name" />
                  <div class="expense-row">
                    <input class="tm-input" type="number" [(ngModel)]="newExpenseAmount" placeholder="Amount" />
                    <input class="tm-input" [(ngModel)]="newExpenseCategory" placeholder="Category (food, transport...)" />
                  </div>
                  <div class="note-actions">
                    <button class="tm-btn tm-btn-sm tm-btn-success" (click)="saveExpense()">Add</button>
                    <button class="tm-btn tm-btn-sm tm-btn-outline" (click)="cancelExpense()">Cancel</button>
                  </div>
                </div>
              }
              @if (expenses.length > 0) {
                <div class="expense-summary">
                  <div class="expense-total">Total: <strong>\${{ totalExpenses }}</strong></div>
                  <div class="expense-breakdown">
                    @for (cat of expenseCategories; track cat) {
                      <span class="expense-cat">{{ cat.category }}: \${{ cat.total }}</span>
                    }
                  </div>
                </div>
              }
              @if (expenses.length === 0 && !showNewExpense) {
                <div class="empty-tab">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="6" x2="12" y2="18"/><line x1="6" y1="12" x2="18" y2="12"/></svg>
                  <p>Track your trip expenses</p>
                </div>
              }
              <div class="expense-list">
                @for (exp of expenses; track $index) {
                  <div class="expense-item">
                    <div class="expense-info">
                      <strong>{{ exp.title }}</strong>
                      <span class="muted">{{ exp.category }}</span>
                    </div>
                    <div class="expense-amount">\${{ exp.amount }}</div>
                    <button class="icon-btn-sm danger" (click)="deleteExpense($index)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                }
              </div>
            </div>
          }
          @if (tripTab === 'weather') {
            <div class="weather-tab">
              <h3>Weather Info</h3>
              @if (trip.places && trip.places.length > 0) {
                <div class="weather-cards">
                  @for (p of trip.places.slice(0, 5); track $index) {
                    <div class="weather-card">
                      <div class="weather-city">{{ getPlaceCityForWeather(p) }}</div>
                      <div class="weather-temp">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                        <span [innerHTML]="getWeatherIcon(getPlaceCityForWeather(p))"></span>
                      </div>
                      <span class="weather-note">Check local forecast</span>
                    </div>
                  }
                </div>
              } @else {
                <div class="empty-tab">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
                  <p>Add places to your trip to see weather info</p>
                </div>
              }
            </div>
          }

          @if (tripTab === 'journal') {
            <div class="journal-tab">
              <div class="journal-header">
                <h3>Travel Journal</h3>
                <button class="tm-btn tm-btn-sm" (click)="addEntry()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  New Entry
                </button>
              </div>
              @if (editingEntry) {
                <div class="entry-editor">
                  <input class="tm-input" [(ngModel)]="entryTitle" placeholder="Entry title (e.g. Day 1 in Cairo)" />
                  <input class="tm-input" [(ngModel)]="entryMood" placeholder="Mood (e.g. Amazed)" />
                  <textarea class="tm-input" [(ngModel)]="entryBody" rows="5" placeholder="Write about your day..."></textarea>
                  <div class="note-actions">
                    <button class="tm-btn tm-btn-sm tm-btn-success" (click)="saveEntry()">Save</button>
                    <button class="tm-btn tm-btn-sm tm-btn-outline" (click)="editingEntry = false">Cancel</button>
                  </div>
                </div>
              }
              @if (journals.length === 0 && !editingEntry) {
                <div class="empty-tab">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  <p>Document your journey — entries are saved offline</p>
                </div>
              }
              <div class="entry-list">
                @for (e of journals; track e.id) {
                  <div class="entry-card">
                    <div class="entry-top">
                      <strong>{{ e.title || 'Untitled' }}</strong>
                      <div class="entry-actions">
                        <button class="icon-btn-sm" (click)="editEntry(e)" title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"/></svg></button>
                        <button class="icon-btn-sm danger" (click)="deleteEntry(e.id)" title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                      </div>
                    </div>
                    @if (e.mood) { <div class="entry-mood">{{ e.mood }}</div> }
                    <p class="entry-body">{{ e.body }}</p>
                    <span class="entry-date">{{ e.date | date:'MMM d, yyyy' }}</span>
                  </div>
                }
              </div>
            </div>
          }

          @if (tripTab === 'memories') {
            <div class="memories-tab">
              <div class="mem-header">
                <h3>Photo Memories</h3>
                <label class="tm-btn tm-btn-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  Add Photo
                  <input type="file" accept="image/*" (change)="onPhoto($event)" hidden />
                </label>
              </div>
              @if (photos.length === 0) {
                <div class="empty-tab">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  <p>Add photos to remember this trip (stored offline)</p>
                </div>
              } @else {
                <div class="photo-grid">
                  @for (p of photos; track p.id) {
                    <div class="photo-card">
                      <img [src]="p.data" alt="{{ p.caption }}" class="photo-img" />
                      <div class="photo-overlay">
                        <span class="photo-cap">{{ p.caption || 'No caption' }}</span>
                        <button class="photo-del" (click)="deletePhoto(p.id)" title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }

          @if (tripTab === 'share') {
            <div class="share-tab">
              <h3>Share This Trip</h3>
              <p class="muted">Generate a shareable link or a code card to send to friends.</p>
              <div class="share-card">
                 <div class="share-link-row">
                  <input class="tm-input" [value]="shareLink" readonly (click)="selectAndCopy($event)" />
                  <button class="tm-btn tm-btn-sm" (click)="copyShareLink()">{{ translation.t('ui.copy') }}</button>
                </div>
                <div class="qr-box">
                  <div class="qr-grid">
                    @for (row of qrPattern; track $index) {
                      <div class="qr-row">
                        @for (cell of row; track $index) {
                          <span class="qr-cell" [class.on]="cell"></span>
                        }
                      </div>
                    }
                  </div>
                  <span class="qr-note">Trip Code (scan-style pattern)</span>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="empty-box">{{ translation.t('ui.notFound') }}</div>
      }

      <app-modal [open]="showCancelModal" [showFooter]="true" title="Cancel this trip?"
        [confirmLabel]="translation.t('ui.cancel')" cancelLabel="Keep Trip" (close)="showCancelModal = false" (confirm)="confirmCancelTrip()">
        <p>Are you sure you want to cancel this trip? This action cannot be undone and any assigned guide, driver, and vehicle will be released.</p>
      </app-modal>
    </div>
  `,
  styles: [`
    .back-link { display: inline-flex; align-items: center; gap: 0.3rem; margin-bottom: 1rem; color: var(--tm-muted); font-size: 0.85rem; }
    .back-link:hover { color: var(--tm-primary); }
    .error-box { padding: 1rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; color: #a33a32; }
    .empty-box { padding: 2rem; text-align: center; color: var(--tm-muted); }

    .detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    .detail-header h2 { margin: 0.5rem 0 0; font-size: 1.5rem; }
    .trip-price-large { font-size: 1.5rem; font-weight: 800; color: var(--tm-primary); }

    .detail-grid { display: grid; grid-template-columns: 1fr 280px; gap: 1rem; margin-bottom: 1.5rem; }

    .info-section { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
    .info-row { display: flex; align-items: center; gap: 0.75rem; }
    .info-row svg { color: var(--tm-primary); flex-shrink: 0; }
    .info-label { display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); font-weight: 600; }
    .info-value { display: block; font-size: 0.9rem; }

    .actions-section { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.25rem; }
    .actions-section h3 { margin: 0 0 0.75rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); }
    .action-btns { display: flex; flex-direction: column; gap: 0.5rem; }
    .action-btns .tm-btn { width: 100%; justify-content: center; }
    .shared-badge { margin-top: 0.75rem; display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: var(--tm-primary); padding: 0.4rem 0.6rem; background: rgba(17,17,17,0.1); border-radius: 8px; }

    .share-link-section { margin-top: 0.75rem; }
    .share-label { display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); font-weight: 600; margin-bottom: 0.3rem; }
    .share-input-wrap { display: flex; gap: 0.3rem; align-items: center; }
    .share-input { margin: 0; font-size: 0.8rem; flex: 1; }
    .copy-btn { background: none; border: none; color: var(--tm-muted); cursor: pointer; padding: 6px; border-radius: 6px; display: flex; }
    .copy-btn:hover { background: var(--glass-hover); color: var(--tm-primary); }

    .trip-tabs { display: flex; gap: 0; margin-bottom: 1rem; background: var(--tm-surface); border-radius: 10px; border: 1px solid var(--glass-border); overflow: hidden; }
    .tab-btn { flex: 1; padding: 0.65rem; border: none; background: none; color: var(--tm-muted); font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: all 0.15s; text-align: center; }
    .tab-btn:hover { background: var(--glass-hover); color: var(--tm-text); }
    .tab-btn.active { background: rgba(17,17,17,0.12); color: var(--tm-primary); font-weight: 600; }

    .tab-content { min-height: 200px; }

    .overview-tab { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .places-section, .timeline-section, .reviews-section { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.25rem; }
    .reviews-section { grid-column: 1 / -1; }
    .places-section h3, .timeline-section h3, .reviews-section h3 { margin: 0 0 0.75rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--tm-muted); }

    .places-list { display: flex; flex-direction: column; gap: 0.4rem; }
    .place-item { display: flex; align-items: center; gap: 0.6rem; }
    .place-idx { width: 24px; height: 24px; border-radius: 50%; background: rgba(17,17,17,0.12); color: var(--tm-primary); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; flex-shrink: 0; }
    .place-info strong { display: block; font-size: 0.88rem; }
    .place-info span { font-size: 0.78rem; }

    .timeline { display: flex; flex-direction: column; gap: 0.75rem; }
    .tl-item { display: flex; align-items: center; gap: 0.6rem; }
    .tl-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--tm-muted); flex-shrink: 0; }
    .tl-dot.green { background: #3f7a52; }
    .tl-dot.blue { background: var(--tm-primary); }
    .tl-item strong { display: block; font-size: 0.85rem; }
    .tl-item span { font-size: 0.78rem; }

    .review-item { border-bottom: 1px solid var(--glass-border); padding: 0.75rem 0; }
    .review-item:last-child { border-bottom: none; }
    .review-stars { display: flex; gap: 0.15rem; color: #9a7b3a; margin-bottom: 0.3rem; }
    .review-comment { margin: 0; font-size: 0.85rem; }

    .notes-tab, .checklist-tab, .expenses-tab, .weather-tab { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.25rem; }
    .notes-header, .checklist-header, .expenses-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .notes-header h3, .checklist-header h3, .expenses-header h3, .weather-tab h3 { margin: 0; font-size: 0.95rem; }

    .note-editor, .new-checklist-item, .new-expense { margin-bottom: 1rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 10px; border: 1px solid var(--glass-border); }
    .note-editor .tm-input, .new-checklist-item .tm-input, .new-expense .tm-input { margin-bottom: 0.5rem; }
    .note-actions, .expense-row { display: flex; gap: 0.4rem; }
    .expense-row .tm-input { flex: 1; }

    .notes-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .note-card { border: 1px solid var(--glass-border); border-radius: 10px; padding: 0.85rem; }
    .note-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem; }
    .note-card-actions { display: flex; gap: 0.25rem; }
    .note-card p { margin: 0; font-size: 0.85rem; color: var(--tm-muted); white-space: pre-wrap; }

    .icon-btn-sm { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; background: none; border: none; color: var(--tm-muted); cursor: pointer; }
    .icon-btn-sm:hover { background: var(--glass-hover); color: var(--tm-text); }
    .icon-btn-sm.danger:hover { background: rgba(239,68,68,0.12); color: #a33a32; }

    .template-picker { margin-bottom: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.02); border-radius: 10px; border: 1px solid var(--glass-border); }
    .template-picker strong { display: block; font-size: 0.8rem; margin-bottom: 0.5rem; color: var(--tm-muted); text-transform: uppercase; letter-spacing: 0.04em; }
    .template-list { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.5rem; }
    .template-btn { display: flex; align-items: center; gap: 0.3rem; padding: 0.35rem 0.7rem; border: 1px solid var(--glass-border); border-radius: 8px; background: none; color: var(--tm-text); font-size: 0.8rem; cursor: pointer; transition: all 0.15s; }
    .template-btn:hover { background: var(--glass-hover); border-color: var(--tm-primary); }
    .template-btn svg { color: var(--tm-primary); }

    .checklist-progress { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
    .progress-bar { flex: 1; height: 6px; background: var(--glass-border); border-radius: 999px; overflow: hidden; }
    .progress-fill { height: 100%; background: var(--tm-primary); border-radius: 999px; transition: width 0.3s; }
    .progress-text { font-size: 0.8rem; color: var(--tm-muted); white-space: nowrap; }

    .checklist-items { display: flex; flex-direction: column; gap: 0.3rem; }
    .checklist-item { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border-radius: 8px; border: 1px solid var(--glass-border); }
    .checklist-item.done { opacity: 0.5; }
    .check-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; flex: 1; }
    .check-label input { display: none; }
    .check-box { width: 20px; height: 20px; border-radius: 4px; border: 2px solid var(--tm-muted); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .checklist-item.done .check-box { border-color: var(--tm-primary); background: var(--tm-primary); }
    .check-box svg { color: #fff; }
    .check-text { font-size: 0.88rem; }
    .checklist-item.done .check-text { text-decoration: line-through; }

    .empty-tab { text-align: center; padding: 2rem; color: var(--tm-muted); }
    .empty-tab svg { margin-bottom: 0.5rem; opacity: 0.5; }
    .empty-tab p { margin: 0; }

    .expense-summary { margin-bottom: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.02); border-radius: 8px; }
    .expense-total { font-size: 0.9rem; margin-bottom: 0.3rem; }
    .expense-breakdown { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .expense-cat { font-size: 0.78rem; color: var(--tm-muted); }

    .expense-list { display: flex; flex-direction: column; gap: 0.3rem; }
    .expense-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 8px; border: 1px solid var(--glass-border); }
    .expense-info { flex: 1; }
    .expense-info strong { display: block; font-size: 0.85rem; }
    .expense-info span { font-size: 0.75rem; }
    .expense-amount { font-weight: 700; color: var(--tm-primary); }

    .weather-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem; }
    .weather-card { border: 1px solid var(--glass-border); border-radius: 10px; padding: 1rem; text-align: center; }
    .weather-city { font-weight: 600; font-size: 0.85rem; margin-bottom: 0.5rem; }
    .weather-temp { font-size: 1.5rem; margin-bottom: 0.25rem; display: flex; align-items: center; justify-content: center; gap: 0.3rem; }
    .weather-temp svg { color: var(--tm-primary); }
    .weather-note { font-size: 0.72rem; color: var(--tm-muted); }

    .journal-tab, .memories-tab, .share-tab { background: var(--tm-surface); border: 1px solid var(--glass-border); border-radius: 12px; padding: 1.25rem; }
    .journal-header, .mem-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .journal-header h3, .mem-header h3, .share-tab h3 { margin: 0; font-size: 0.95rem; }
    .entry-editor { margin-bottom: 1rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 10px; border: 1px solid var(--glass-border); }
    .entry-editor .tm-input { margin-bottom: 0.5rem; }
    .entry-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .entry-card { border: 1px solid var(--glass-border); border-radius: 10px; padding: 0.85rem; }
    .entry-top { display: flex; justify-content: space-between; align-items: center; }
    .entry-top strong { font-size: 0.9rem; }
    .entry-actions { display: flex; gap: 0.25rem; }
    .entry-mood { font-size: 0.8rem; color: var(--tm-primary); margin: 0.25rem 0; }
    .entry-body { margin: 0.3rem 0; font-size: 0.85rem; color: var(--tm-muted); white-space: pre-wrap; line-height: 1.5; }
    .entry-date { font-size: 0.72rem; color: var(--tm-muted); opacity: 0.7; }

    .photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem; }
    .photo-card { position: relative; border-radius: 10px; overflow: hidden; aspect-ratio: 1; border: 1px solid var(--glass-border); }
    .photo-img { width: 100%; height: 100%; object-fit: cover; }
    .photo-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent 60%); display: flex; align-items: flex-end; justify-content: space-between; padding: 0.5rem; opacity: 0; transition: opacity 0.2s; }
    .photo-card:hover .photo-overlay { opacity: 1; }
    .photo-cap { font-size: 0.72rem; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .photo-del { background: rgba(239,68,68,0.8); border: none; color: #fff; border-radius: 6px; padding: 4px; cursor: pointer; display: flex; flex-shrink: 0; }

    .share-tab p { margin: 0 0 1rem; }
    .share-card { padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 10px; border: 1px solid var(--glass-border); }
    .share-link-row { display: flex; gap: 0.4rem; margin-bottom: 1rem; }
    .share-link-row .tm-input { flex: 1; margin: 0; font-size: 0.8rem; }
    .qr-box { text-align: center; }
    .qr-grid { display: inline-block; padding: 0.75rem; background: #fff; border-radius: 10px; }
    .qr-row { display: flex; }
    .qr-cell { width: 7px; height: 7px; }
    .qr-cell.on { background: #000; }
    .qr-note { display: block; font-size: 0.72rem; color: var(--tm-muted); margin-top: 0.5rem; }
  `]
})
export class TripDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tripService = inject(TripService);
  private reviewService = inject(ReviewService);
  translation = inject(TranslationService);
  private toast = inject(ToastService);
  private local = inject(LocalService);
  trip?: Trip;
  reviews: any[] = [];
  loading = true;
  error = '';
  showCancelModal = false;

  tripTab: 'overview' | 'notes' | 'checklist' | 'expenses' | 'weather' | 'journal' | 'memories' | 'share' = 'overview';

  // Journal
  journals: JournalEntry[] = [];
  editingEntry = false;
  editingEntryId = '';
  entryTitle = '';
  entryBody = '';
  entryMood = '';

  // Memories
  photos: TripPhoto[] = [];

  // Share / QR
  get shareLink() { return `${window.location.origin}/app/trip/${this.trip?._id}`; }
  get qrPattern(): boolean[][] {
    const seed = (this.trip?._id || 'tourmate').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const size = 11;
    const grid: boolean[][] = [];
    for (let r = 0; r < size; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < size; c++) {
        row.push(((seed * (r * 31 + c * 17 + 7)) % 3) === 0);
      }
      grid.push(row);
    }
    return grid;
  }

  notes: { title: string; text: string }[] = [];
  editingNote = -1;
  noteTitle = '';
  noteText = '';

  checklistItems: { text: string; done: boolean }[] = [];
  showNewChecklistItem = false;
  showTemplates = false;
  newChecklistText = '';
  packingTemplates = [
    { name: 'Beach Trip', items: ['Sunscreen', 'Swimsuit', 'Towel', 'Sunglasses', 'Hat', 'Flip flops', 'Beach bag', 'Water bottle'] },
    { name: 'City Tour', items: ['Comfortable shoes', 'Camera', 'Power bank', 'Map', 'Umbrella', 'Water bottle', 'Snacks', 'Hand sanitizer'] },
    { name: 'Hiking', items: ['Hiking boots', 'Backpack', 'First aid kit', 'Compass', 'Snacks', 'Extra socks', 'Rain jacket', 'Headlamp'] },
    { name: 'Business Trip', items: ['Laptop', 'Charger', 'Notebook', 'Pen', 'Business cards', 'Formal wear', 'Toiletries', 'Travel adapter'] },
    { name: 'Weekend Getaway', items: ['Change of clothes', 'Toiletries', 'Phone charger', 'Book', 'Snacks', 'Camera', 'Wallet', 'Keys'] },
  ];

  expenses: { title: string; amount: number; category: string }[] = [];
  showNewExpense = false;
  newExpenseTitle = '';
  newExpenseAmount = 0;
  newExpenseCategory = '';

  get checkedItems() { return this.checklistItems.filter(i => i.done).length; }
  get checklistProgress() { return this.checklistItems.length ? (this.checkedItems / this.checklistItems.length) * 100 : 0; }
  get totalExpenses() { return this.expenses.reduce((s, e) => s + e.amount, 0); }
  get expenseCategories() {
    const map = new Map<string, number>();
    this.expenses.forEach(e => map.set(e.category || 'other', (map.get(e.category || 'other') || 0) + e.amount));
    return Array.from(map.entries()).map(([category, total]) => ({ category, total }));
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.tripService.getById(id).subscribe({
      next: (res) => { this.trip = res.data; this.loading = false; this.loadReviews(); this.loadLocalData(); },
      error: (e) => {
        this.loading = false;
        this.error = e.error?.message || 'Failed to load trip';
        this.toast.error(this.error);
      },
    });
  }

  loadReviews() {
    if (this.trip?._id) {
      this.reviewService.getTripReviews(this.trip._id).subscribe({
        next: (res) => this.reviews = res.data || [],
        error: () => {},
      });
    }
  }

  loadLocalData() {
    const id = this.trip?._id;
    if (!id) return;
    try {
      const saved = localStorage.getItem(`tm_trip_notes_${id}`);
      if (saved) this.notes = JSON.parse(saved);
      const savedCl = localStorage.getItem(`tm_trip_checklist_${id}`);
      if (savedCl) this.checklistItems = JSON.parse(savedCl);
      const savedEx = localStorage.getItem(`tm_trip_expenses_${id}`);
      if (savedEx) this.expenses = JSON.parse(savedEx);
      this.journals = this.local.getJournals(id);
      this.photos = this.local.getPhotos(id);
    } catch {}
  }

  // Journal
  addEntry() {
    this.editingEntry = true;
    this.editingEntryId = '';
    this.entryTitle = '';
    this.entryBody = '';
    this.entryMood = '';
  }
  editEntry(e: JournalEntry) {
    this.editingEntry = true;
    this.editingEntryId = e.id;
    this.entryTitle = e.title;
    this.entryBody = e.body;
    this.entryMood = e.mood || '';
  }
  saveEntry() {
    if (!this.entryBody.trim()) return;
    const id = this.trip?._id;
    if (!id) return;
    if (this.editingEntryId) {
      this.local.saveJournal(id, { id: this.editingEntryId, title: this.entryTitle, body: this.entryBody, mood: this.entryMood, date: new Date().toISOString(), createdAt: this.journals.find(j => j.id === this.editingEntryId)?.createdAt || new Date().toISOString() });
    } else {
      this.local.saveJournal(id, { id: crypto.randomUUID(), title: this.entryTitle, body: this.entryBody, mood: this.entryMood, date: new Date().toISOString(), createdAt: new Date().toISOString() });
    }
    this.journals = this.local.getJournals(id);
    this.editingEntry = false;
    this.toast.success('Journal saved');
  }
  deleteEntry(id: string) {
    if (this.trip?._id) { this.local.deleteJournal(this.trip._id, id); this.journals = this.local.getJournals(this.trip._id); }
  }

  // Photos
  onPhoto(event: any) {
    const file = event.target.files?.[0];
    if (!file || !this.trip?._id) return;
    const reader = new FileReader();
    reader.onload = () => {
      const id = this.trip!._id!;
      this.local.savePhoto(id, { id: crypto.randomUUID(), caption: file.name, data: reader.result as string, createdAt: new Date().toISOString() });
      this.photos = this.local.getPhotos(id);
      this.toast.success('Photo added');
    };
    reader.readAsDataURL(file);
  }
  deletePhoto(id: string) {
    if (this.trip?._id) { this.local.deletePhoto(this.trip._id, id); this.photos = this.local.getPhotos(this.trip._id); }
  }

  saveLocalData() {
    const id = this.trip?._id;
    if (!id) return;
    localStorage.setItem(`tm_trip_notes_${id}`, JSON.stringify(this.notes));
    localStorage.setItem(`tm_trip_checklist_${id}`, JSON.stringify(this.checklistItems));
    localStorage.setItem(`tm_trip_expenses_${id}`, JSON.stringify(this.expenses));
  }

  addNote() { this.editingNote = -2; this.noteTitle = ''; this.noteText = ''; }
  editNote(idx: number) { this.editingNote = idx; this.noteTitle = this.notes[idx].title; this.noteText = this.notes[idx].text; }
  cancelNote() { this.editingNote = -1; this.noteTitle = ''; this.noteText = ''; }
  saveNote() {
    if (!this.noteText.trim()) return;
    if (this.editingNote === -2) {
      this.notes.push({ title: this.noteTitle, text: this.noteText });
    } else if (this.editingNote >= 0) {
      this.notes[this.editingNote] = { title: this.noteTitle, text: this.noteText };
    }
    this.cancelNote();
    this.saveLocalData();
    this.toast.success('Note saved');
  }
  deleteNote(idx: number) { this.notes.splice(idx, 1); this.saveLocalData(); }

  addChecklistItem() { this.showNewChecklistItem = true; this.newChecklistText = ''; }
  saveChecklistItem() {
    if (!this.newChecklistText.trim()) return;
    this.checklistItems.push({ text: this.newChecklistText, done: false });
    this.newChecklistText = '';
    this.showNewChecklistItem = false;
    this.saveLocalData();
  }
  toggleChecklistItem(idx: number) { this.checklistItems[idx].done = !this.checklistItems[idx].done; this.saveLocalData(); }
  deleteChecklistItem(idx: number) { this.checklistItems.splice(idx, 1); this.saveLocalData(); }
  loadTemplate(items: string[]) {
    items.forEach(text => { if (!this.checklistItems.find(i => i.text === text)) { this.checklistItems.push({ text, done: false }); } });
    this.showTemplates = false;
    this.saveLocalData();
    this.toast.success('Template loaded');
  }

  addExpense() { this.showNewExpense = true; this.newExpenseTitle = ''; this.newExpenseAmount = 0; this.newExpenseCategory = ''; }
  cancelExpense() { this.showNewExpense = false; }
  saveExpense() {
    if (!this.newExpenseTitle.trim() || !this.newExpenseAmount) return;
    this.expenses.push({ title: this.newExpenseTitle, amount: this.newExpenseAmount, category: this.newExpenseCategory || 'other' });
    this.cancelExpense();
    this.saveLocalData();
  }
  deleteExpense(idx: number) { this.expenses.splice(idx, 1); this.saveLocalData(); }

  getPlaceName(p: any, idx: number): string {
    return typeof p === 'object' && p !== null ? (p.name || 'Place ' + (idx + 1)) : 'Place ' + (idx + 1);
  }
  getPlaceCity(p: any): string {
    return typeof p === 'object' && p !== null && p.city ? p.city + ' ' : '';
  }
  getPlaceCityForWeather(p: any): string {
    if (typeof p === 'object' && p !== null) return p.city || p.name || 'Location';
    return 'Location';
  }
  getPlaceCategory(p: any): string {
    return typeof p === 'object' && p !== null && p.category ? '- ' + p.category : '';
  }

  getWeatherIcon(city: string): string {
    const icons = [
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><line x1="12" y1="3" x2="12" y2="5"/></svg>',
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><line x1="12" y1="15" x2="12" y2="19"/><line x1="9" y1="17" x2="15" y2="17"/></svg>',
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><line x1="12" y1="15" x2="12" y2="19"/></svg>',
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><line x1="12" y1="13" x2="12" y2="17"/><line x1="9" y1="15" x2="15" y2="15"/><line x1="10" y1="9" x2="14" y2="9"/></svg>',
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><line x1="12" y1="15" x2="12" y2="19"/><line x1="9" y1="17" x2="15" y2="17"/></svg>',
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/><path d="M4.22 4.22l15.56 15.56"/></svg>'
    ];
    return icons[city.length % icons.length];
  }

  exportTrip() {
    if (!this.trip) return;
    const data = {
      exportedAt: new Date().toISOString(),
      trip: this.trip,
      notes: this.notes,
      checklist: this.checklistItems,
      expenses: this.expenses,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trip-${this.trip._id || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast.success('Trip exported');
  }

  selectAndCopy(event: Event) {
    const el = event.target as HTMLInputElement;
    if (el) el.select();
    this.copyShareLink();
  }

  copyShareLink() {
    navigator.clipboard?.writeText(this.shareLink);
    this.toast.success('Link copied!');
  }

  startTrip() { if (this.trip?._id) this.tripService.startTrip(this.trip._id).subscribe({ next: () => { this.toast.success('Trip started'); this.ngOnInit(); }, error: (e) => this.toast.error(e.error?.message || 'Failed') }); }
  completeTrip() { if (this.trip?._id) this.tripService.completeTrip(this.trip._id).subscribe({ next: () => { this.toast.success('Trip completed'); this.ngOnInit(); }, error: (e) => this.toast.error(e.error?.message || 'Failed') }); }
  cancelTrip() {
    if (!this.trip?._id) return;
    this.showCancelModal = true;
  }

  confirmCancelTrip() {
    this.showCancelModal = false;
    if (!this.trip?._id) return;
    this.tripService.cancelTrip(this.trip._id).subscribe({
      next: () => { this.toast.success('Trip cancelled'); this.ngOnInit(); },
      error: (e) => this.toast.error(e.error?.message || 'Failed'),
    });
  }
  toggleShare() { if (this.trip?._id) this.tripService.shareTrip(this.trip._id, !this.trip.isShared).subscribe({ next: () => { this.toast.success(this.trip!.isShared ? 'Unshared' : 'Shared'); this.ngOnInit(); }, error: (e) => this.toast.error(e.error?.message || 'Failed') }); }
  duplicateTrip() { if (this.trip?._id) this.tripService.duplicateTrip(this.trip._id).subscribe({ next: () => { this.toast.success('Trip duplicated'); this.router.navigate(['/app/trip/list']); }, error: (e) => this.toast.error(e.error?.message || 'Failed') }); }
  deleteTrip() { if (this.trip?._id) this.tripService.delete(this.trip._id).subscribe({ next: () => { this.toast.success('Trip deleted'); this.router.navigate(['/app/trip/list']); }, error: (e) => this.toast.error(e.error?.message || 'Failed') }); }
}
