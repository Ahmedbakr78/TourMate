import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private currentLang = new BehaviorSubject<string>('en');
  currentLang$ = this.currentLang.asObservable();

  private translations: any = {};

  constructor() {
    const saved = localStorage.getItem('lang');
    if (saved) this.currentLang.next(saved);
  }

  setLanguage(lang: string): void {
    this.currentLang.next(lang);
    localStorage.setItem('lang', lang);
    import(`../../../assets/i18n/${lang}.json`).then(t => this.translations = t);
  }

  translate(key: string): string {
    return this.translations[key] || key;
  }

  get currentLangValue(): string {
    return this.currentLang.value;
  }
}
