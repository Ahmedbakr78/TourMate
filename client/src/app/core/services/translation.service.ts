import { Injectable, signal } from '@angular/core';

type Lang = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private translations: Record<string, any> = {};
  currentLang = signal<Lang>('en');
  dir = signal<'ltr' | 'rtl'>('ltr');

  async init() {
    const saved = (localStorage.getItem('tm_lang') as Lang) || 'en';
    await this.load(saved);
  }

  private async load(lang: Lang) {
    try {
      const data = await import(`../../../assets/i18n/${lang}.json`);
      this.translations = data;
      this.currentLang.set(lang);
      this.dir.set(lang === 'ar' ? 'rtl' : 'ltr');
      localStorage.setItem('tm_lang', lang);
      document.documentElement.dir = this.dir();
      document.documentElement.lang = lang;
    } catch {
      console.warn('Translation not found for', lang);
    }
  }

  async setLang(lang: Lang) {
    await this.load(lang);
  }

  t(key: string): string {
    const parts = key.split('.');
    let obj: any = this.translations;
    for (const p of parts) {
      if (obj && typeof obj === 'object' && p in obj) obj = obj[p];
      else return key;
    }
    return typeof obj === 'string' ? obj : key;
  }
}
