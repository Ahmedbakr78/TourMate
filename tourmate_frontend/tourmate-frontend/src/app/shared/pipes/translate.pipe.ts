import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private value = '';
  private destroy$ = new Subject<void>();

  constructor(private languageService: LanguageService) {
    this.languageService.currentLang$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.value = '';
    });
  }

  transform(key: string): string {
    return this.languageService.translate(key);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
