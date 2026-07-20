import { Injectable, signal } from '@angular/core';

export interface FavoritePlace {
  _id: string;
  name: string;
  city: string;
  category: string;
  description?: string;
  coordinates?: { type: string; coordinates: number[] };
  addedAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  body: string;
  mood?: string;
  createdAt: string;
}

export interface TripPhoto {
  id: string;
  caption: string;
  data: string;
  createdAt: string;
}

export interface TripTemplate {
  id: string;
  name: string;
  places: any[];
  peopleCount: number;
  createdAt: string;
}

export interface QuickNote {
  id: string;
  text: string;
  pinned: boolean;
  createdAt: string;
}

const KEYS = {
  favorites: 'tm_favorites',
  journals: 'tm_journals',
  photos: 'tm_photos',
  templates: 'tm_templates',
  notes: 'tm_notes',
};

@Injectable({ providedIn: 'root' })
export class LocalService {
  favorites = signal<FavoritePlace[]>([]);
  notes = signal<QuickNote[]>([]);

  constructor() {
    this.favorites.set(this.read<FavoritePlace[]>(KEYS.favorites, []));
    this.notes.set(this.read<QuickNote[]>(KEYS.notes, []));
  }

  private read<T>(key: string, fallback: T): T {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  }
  private write(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Favorites
  getFavorites(): FavoritePlace[] { return this.read(KEYS.favorites, []); }
  isFavorite(id: string): boolean { return this.getFavorites().some(f => f._id === id); }
  toggleFavorite(p: Omit<FavoritePlace, 'addedAt'>) {
    const list = this.getFavorites();
    const idx = list.findIndex(f => f._id === p._id);
    if (idx >= 0) list.splice(idx, 1);
    else list.unshift({ ...p, addedAt: new Date().toISOString() });
    this.write(KEYS.favorites, list);
    this.favorites.set(list);
  }
  removeFavorite(id: string) {
    const list = this.getFavorites().filter(f => f._id !== id);
    this.write(KEYS.favorites, list);
    this.favorites.set(list);
  }

  // Journals (per trip)
  getJournals(tripId: string): JournalEntry[] {
    return this.read<JournalEntry[]>(`${KEYS.journals}_${tripId}`, []);
  }
  saveJournal(tripId: string, entry: JournalEntry) {
    const list = this.getJournals(tripId);
    const idx = list.findIndex(j => j.id === entry.id);
    if (idx >= 0) list[idx] = entry; else list.unshift(entry);
    this.write(`${KEYS.journals}_${tripId}`, list);
  }
  deleteJournal(tripId: string, id: string) {
    this.write(`${KEYS.journals}_${tripId}`, this.getJournals(tripId).filter(j => j.id !== id));
  }

  // Photos (per trip)
  getPhotos(tripId: string): TripPhoto[] {
    return this.read<TripPhoto[]>(`${KEYS.photos}_${tripId}`, []);
  }
  savePhoto(tripId: string, photo: TripPhoto) {
    const list = this.getPhotos(tripId);
    list.unshift(photo);
    this.write(`${KEYS.photos}_${tripId}`, list);
  }
  deletePhoto(tripId: string, id: string) {
    this.write(`${KEYS.photos}_${tripId}`, this.getPhotos(tripId).filter(p => p.id !== id));
  }

  // Templates
  getTemplates(): TripTemplate[] { return this.read(KEYS.templates, []); }
  saveTemplate(t: TripTemplate) {
    const list = this.getTemplates();
    list.unshift(t);
    this.write(KEYS.templates, list);
  }
  deleteTemplate(id: string) {
    this.write(KEYS.templates, this.getTemplates().filter(t => t.id !== id));
  }

  // Quick Notes (global)
  getNotes(): QuickNote[] { return this.read(KEYS.notes, []); }
  addNote(text: string, pinned = false) {
    const list = this.getNotes();
    list.unshift({ id: crypto.randomUUID(), text, pinned, createdAt: new Date().toISOString() });
    this.write(KEYS.notes, list);
    this.notes.set(list);
  }
  updateNote(id: string, text: string) {
    const list = this.getNotes().map(n => n.id === id ? { ...n, text } : n);
    this.write(KEYS.notes, list);
    this.notes.set(list);
  }
  togglePin(id: string) {
    const list = this.getNotes().map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
    this.write(KEYS.notes, list);
    this.notes.set(list);
  }
  removeNote(id: string) {
    const list = this.getNotes().filter(n => n.id !== id);
    this.write(KEYS.notes, list);
    this.notes.set(list);
  }

  // Backup / Restore
  exportAll(): string {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('tm_')) {
        try { data[k] = JSON.parse(localStorage.getItem(k) || ''); }
        catch { data[k] = localStorage.getItem(k); }
      }
    }
    return JSON.stringify(data, null, 2);
  }
  importAll(json: string): boolean {
    try {
      const data = JSON.parse(json);
      Object.keys(data).forEach(k => {
        if (k.startsWith('tm_')) localStorage.setItem(k, JSON.stringify(data[k]));
      });
      this.favorites.set(this.getFavorites());
      this.notes.set(this.getNotes());
      return true;
    } catch { return false; }
  }
}
