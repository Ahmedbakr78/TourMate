import { Component } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-selector',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="langMenu" matTooltip="{{ 'common.selectLanguage' | translate }}">
      <mat-icon>language</mat-icon>
    </button>
    <mat-menu #langMenu="matMenu">
      <button mat-menu-item *ngFor="let lang of languages" (click)="switchLanguage(lang.code)">
        <span class="flag">{{ lang.flag }}</span>
        <span>{{ lang.label }}</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .flag { margin-right: 8px; }
  `]
})
export class LanguageSelectorComponent {
  languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇪🇬' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' }
  ];

  constructor(private languageService: LanguageService) {}

  switchLanguage(code: string): void {
    this.languageService.setLanguage(code);
  }
}
