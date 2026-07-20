import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { TranslationService } from './core/services/translation.service';

export function initTranslation(ts: TranslationService) {
  return () => ts.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    { provide: APP_INITIALIZER, useFactory: initTranslation, deps: [TranslationService], multi: true },
  ],
};
